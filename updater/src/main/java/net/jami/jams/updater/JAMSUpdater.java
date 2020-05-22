package net.jami.jams.updater;

import net.jami.jams.common.updater.AppUpdater;
import org.apache.http.ssl.SSLContexts;
import org.zeromq.SocketType;
import org.zeromq.ZMQ;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import java.io.*;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyFactory;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import java.util.jar.Manifest;

public class JAMSUpdater implements AppUpdater {

    UpdateDownloader updateDownloader = new UpdateDownloader();
    private SSLSocketFactory sslSocketFactory;
    private SSLContext sslContext = null;
    private ZMQ.Socket publisher;
    private ZMQ.Socket receiver;
    private MessageReceiver messageReceiver;
    private AtomicBoolean doUpdate = new AtomicBoolean(false);

    private HashMap<String, String> localVersions = new HashMap<>();
    private HashMap<String, String> localExecs = new HashMap<>();
    private HashMap<String, String> remoteVersions = new HashMap<>();
    private HashMap<String, String> remoteExecs = new HashMap<>();
    private HashMap<String, String> remoteChecksums = new HashMap<>();

    public JAMSUpdater() {

        try {
            //Use this to notify
            publisher = AppStarter.context.socket(SocketType.PUB);
            publisher.bind("tcp://*:4572");
            //Use this to updater.
            receiver = AppStarter.context.socket(SocketType.REP);
            receiver.bind("tcp://*:4573");
            messageReceiver = new MessageReceiver(receiver, doUpdate);
            messageReceiver.start();
        } catch (Exception e) {
            log.warn("Could not create and bind publisher and/or receiver! Please contact software developer");
            System.exit(-1);
        }
    }

    //It is a VERY bad idea to use version numbers inside file names as this will break at some point and cause MAJOR
    //user problems, we can therefore by-pass this by doing the following.

    public static String[] unzipJar(String destinationDir, String jarPath) throws IOException {
        String[] resp = new String[2];
        File file = new File(jarPath);
        JarFile jar = new JarFile(file);

        // fist get all directories,
        // then make those directory on the destination Path
        for (Enumeration<JarEntry> enums = jar.entries(); enums.hasMoreElements(); ) {
            JarEntry entry = (JarEntry) enums.nextElement();

            String fileName = destinationDir + File.separator + entry.getName();
            File f = new File(fileName);

            if (fileName.endsWith("/")) {
                f.mkdirs();
            }
        }

        //now create all files
        for (Enumeration<JarEntry> enums = jar.entries(); enums.hasMoreElements(); ) {
            JarEntry entry = (JarEntry) enums.nextElement();
            if (entry.toString().contains("META-INF/MANIFEST.MF")) {
                String fileName = destinationDir + File.separator + entry.getName();
                File f = new File(fileName);

                if (!fileName.endsWith("/")) {
                    InputStream is = jar.getInputStream(entry);
                    FileOutputStream fos = new FileOutputStream(f);

                    // write contents of 'is' to 'fos'
                    while (is.available() > 0) {
                        fos.write(is.read());
                    }

                    fos.close();
                    is.close();
                }
            }
        }

        String manifestPath = destinationDir + "/META-INF/MANIFEST.MF";
        Manifest manifest = new Manifest(new URL("file:///" + manifestPath).openStream());
        resp[0] = manifest.getMainAttributes().getValue("Implementation-Version");
        resp[1] = manifest.getMainAttributes().getValue("Main-Class");
        return resp;
    }

    private void discoverVersions(File folderLibs) throws IOException {
        for (File f : Objects.requireNonNull(folderLibs.listFiles())) {
            if (f.isFile() && f.getName().contains(".jar") && !f.getName().contains("jams-launcher")) {
                String[] resp = unzipJar(System.getProperty("user.dir") + "/tmpjar/" + f.getName(), f.getAbsolutePath());
                localVersions.put(resp[1], resp[0]);
                localExecs.put(resp[1], f.getName());
            }
        }
    }

    @Override
    public String getCurrentVersions(String folder) {

        try {
            File folderExec = new File(folder.replace("/jams-launcher", ""));
            File folderLibs = new File(folder.replace("/jams-launcher", "") + "/libs");
            discoverVersions(folderExec);
            discoverVersions(folderLibs);
        } catch (Exception e) {
            log.warn(e.toString());
        }
    }

    public boolean loadLicense() {
        try {
            //Because apparently we should display versions even though the user has no license, we have to
            //do this in two steps:
            CertificateFactory cf = CertificateFactory.getInstance("X.509");
            InputStream input = this.getClass().getClassLoader().getResourceAsStream("oem/ca.crt");
            if (input == null) {
                System.out.println("No CA Found... this is critical!");
                System.exit(-1);
            }
            Certificate ca = cf.generateCertificate(input);
            KeyStore trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
            trustStore.load(null, null);
            trustStore.setCertificateEntry("ca", ca);
            //Inject the SSL Connection here for a first time.
            sslContext = SSLContexts.custom().loadTrustMaterial(trustStore, null)
                    .build();
            //The below will either pass or fail..
            KeyStore ks = KeyStore.getInstance("JKS");
            ks.load(null);
            if(!Files.exists(Path.of(System.getProperty("user.dir") + File.separator + "license.dat"))){
                System.out.println("You do not have a valid license - ignoring the rest of this function.");
                System.out.println("You will still be notified about updates!");
                return false;
            }
            //Assuming the file exists, we just read the file.
            String b64License = new String(Files.readAllBytes(Path.of(System.getProperty("user.dir") + File.separator + "license.dat")));
            //Since this is base64, we need to decode it.
            String strLicense = new String(Base64.getDecoder().decode(b64License));
            //Now we need to split it. This is actually easy.
            int cutPoint = strLicense.indexOf("-----BEGIN PRIVATE KEY-----");

            String publicKey = strLicense.substring(0, cutPoint);
            String privateKey = strLicense.substring(cutPoint);

            privateKey = privateKey.replaceAll("\\n", "").replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "");
            KeyFactory kf = KeyFactory.getInstance("RSA");
            PKCS8EncodedKeySpec keysp = new PKCS8EncodedKeySpec(Base64.getDecoder().decode(privateKey));
            PrivateKey pvk = kf.generatePrivate(keysp);

            InputStream inputStream = new ByteArrayInputStream(publicKey.getBytes(Charset.forName("UTF-8")));
            Certificate c = cf.generateCertificate(inputStream);
            Certificate[] chain = new Certificate[]{c};

            String alias1 = ((X509Certificate) c).getSubjectX500Principal().getName();
            ks.setCertificateEntry(alias1, c);
            ks.setKeyEntry("", pvk, "".toCharArray(), chain);
            try {
                ((X509Certificate) c).checkValidity();
                c.verify(ca.getPublicKey());
            } catch (Exception e) {
                log.warn("Your license is no longer valid or has been tampered with - " + e.toString());
                return false;
            }
            sslContext = SSLContexts.custom().loadKeyMaterial(ks, "".toCharArray()).loadTrustMaterial(trustStore, null)
                    .build();
        } catch (Exception e) {
            log.warn("Could not read license file with error " + e.toString());
            return false;
        }
        return true;
    }

    //If the user clicks start update then kill, download, start
    public void checkUpdate(){
        //Step 1: download the JSON file description (this would also contain the signatures).
        getLatestVersion();
        //Step 2: compare the versions - we assume no admin is stupid enough to regress versions.
        getCurrentVersions(System.getProperty("user.dir"));
        localVersions.forEach((k, v) -> {
            if (remoteVersions.containsKey(k) && remoteVersions.get(k).equals(v)) {
                remoteVersions.remove(k);
                remoteExecs.remove(k);
            }
        });
        //Step 3: If there are no valid remote versions available, send an empty JSON.
        if (remoteVersions.size() == 0){
            publisher.sendMore("UPDATE");
            publisher.send("{}");
            return;
        }
        else {
            //In the new paradigm, we notify the server via zmq.
            publisher.sendMore("UPDATE");
            publisher.send(remoteVersions.toString());
        }
    }



    @Override
    public String getLatestVersion() {
        return null;
    }

    @Override
    public boolean downloadUpdates() {
        return updateDownloader.doUpdate();
    }
}
