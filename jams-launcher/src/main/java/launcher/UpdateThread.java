package launcher;

import com.google.common.hash.HashCode;
import com.google.common.hash.Hashing;
import com.jsoniter.JsonIterator;
import com.jsoniter.any.Any;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContexts;
import org.codehaus.plexus.util.FileUtils;
import org.zeromq.SocketType;
import org.zeromq.ZMQ;

import javax.net.ssl.SSLContext;
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
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import java.util.jar.Manifest;
import java.util.logging.Logger;

@Getter
@Setter
@Slf4j
public class UpdateThread extends Thread {

    private HashMap<String, String> localVersions = new HashMap<>();
    private HashMap<String, String> localExecs = new HashMap<>();
    private HashMap<String, String> remoteVersions = new HashMap<>();
    private HashMap<String, String> remoteExecs = new HashMap<>();
    private HashMap<String, String> remoteChecksums = new HashMap<>();

    private String[] parentArgs;
    private static volatile String CORE_PACKAGE_MAIN_CLASS_NAME;
    private static volatile String UPDATE_SERVER_URL;
    private static volatile Long UPDATE_INTERVAL;
    private SSLContext sslContext = null;
    private Process applicationProcess;
    private ZMQ.Socket publisher;
    private ZMQ.Socket receiver;
    private AtomicBoolean doUpdate = new AtomicBoolean(false);
    private MessageReceiver messageReceiver;

    public UpdateThread() {
    }

    public UpdateThread(Process applicationProcess, String[] parentArgs) {
        try {
            //Use this to notify
            publisher = AppStarter.context.socket(SocketType.PUB);
            publisher.bind("tcp://*:4572");
            //Use this to updater.
            receiver = AppStarter.context.socket(SocketType.REP);
            receiver.bind("tcp://*:4573");
            messageReceiver = new MessageReceiver(receiver,doUpdate);
            messageReceiver.start();
        } catch (Exception e) {
            log.warn("Could not create and bind publisher and/or receiver! Please contact software developer");
            System.exit(-1);
        }

        try {
            InputStream input = AppStarter.class.getClassLoader().getResourceAsStream("oem/config.json");
            Any any = JsonIterator.deserialize(input.readAllBytes());
            CORE_PACKAGE_MAIN_CLASS_NAME = any.get("CORE_PACKAGE_MAIN_CLASS_NAME").toString();
            UPDATE_SERVER_URL = any.get("UPDATE_URL").toString();
            UPDATE_INTERVAL = any.get("UPDATE_INTERVAL").toLong();

        } catch (IOException e) {
            log.warn("Missing OEM configuration! Please contact software developer");
            System.exit(-1);
        }

        System.out.println("Update thread created...");
        this.parentArgs = parentArgs;
        this.applicationProcess = applicationProcess;
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

    public void detectCurrentVersions(String folder) {
        try {
            File folderExec = new File(folder.replace("/jams-launcher", ""));
            File folderLibs = new File(folder.replace("/jams-launcher", "") + "/libs");
            discoverVersions(folderExec);
            discoverVersions(folderLibs);
        } catch (Exception e) {
            log.warn(e.toString());
        }
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

    // This reads a file on the server which contains some basic info
    // about what new versions of WHAT are available.
    private void getLatestVersion() {
        try {
            //Step 1: Download a file called versions.json
            HttpClient httpClient = HttpClients.custom().setSSLContext(sslContext).build();
            HttpResponse response = httpClient.execute(new HttpGet(UPDATE_SERVER_URL + "/versions.json"));
            //Step 2: Load the file into the hashmaps
            Any any = JsonIterator.deserialize(response.getEntity().getContent().readAllBytes());
            any.asMap().forEach((k, v) -> {
                remoteVersions.put(k, v.get("version").toString());
                remoteExecs.put(k, v.get("filename").toString());
                remoteChecksums.put(k, v.get("md5").toString());
            });
        } catch (Exception e) {
            log.warn("Could not establish connection to JAMS Update Center with error: " + e.toString());
        }
    }

    //You only need to load the keystore once, never do it again, you
    //can theoretically put it as timer if you don't want users to
    //restart the app.
    public boolean loadLicense() {
        try {
            //Because apparently we should display versions even though the user has no license, we have to
            //do this in two steps:
            CertificateFactory cf = CertificateFactory.getInstance("X.509");
            InputStream input = AppStarter.class.getClassLoader().getResourceAsStream("oem/ca.crt");
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

    public void downloadFiles(HashMap<String, String> files) {
        //I know this contradicts my dogma, but this really would have been an overkill for this project,
        //I just claim that everything which is not core gets dumped to the lib directory.

        // temp folder for safe download and integrity check
        File tmpFolder = new File(System.getProperty("user.dir") + "/tmp/");
        tmpFolder.mkdirs();

        files.forEach((k, v) -> {
            try {
                HttpClient httpClient = HttpClients.custom().setSSLContext(sslContext).build();
                HttpResponse httpResponse = httpClient.execute(new HttpGet(UPDATE_SERVER_URL + "/updates/" + v));
                if (httpResponse.getStatusLine().getStatusCode() == 200) {
                    log.info(tmpFolder.getPath() + "/" + files.get(k));
                    FileOutputStream fos = new FileOutputStream(tmpFolder.getPath() + "/" + files.get(k));
                    if (k.equals(CORE_PACKAGE_MAIN_CLASS_NAME)) {
                        httpResponse.getEntity().writeTo(fos);
                        fos.close();

                        if (checksum(tmpFolder.getPath() + "/" + files.get(k)).equals(remoteChecksums.get(k))) {
                            log.info("Successfully downloaded the core package!");
                            remoteChecksums.remove(CORE_PACKAGE_MAIN_CLASS_NAME);
                        }

                    } else {
                        httpResponse.getEntity().writeTo(fos);
                        fos.close();

                        if (checksum(tmpFolder.getPath() + "/" + files.get(k)).equals(remoteChecksums.get(k))) {
                            log.info("Successfully downloaded a library package!");
                            remoteChecksums.remove(remoteChecksums.get(k));
                        }
                    }

                } else {
                    log.warn("The server declared an update but does not have the required files?!");
                }
            } catch (Exception e1) {
                log.warn("Could not download an update with error " + e1.toString());
            }
        });
    }

    //If the user clicks start update then kill, download, start
    public void checkUpdate(){
        //Step 1: download the JSON file description (this would also contain the signatures).
        getLatestVersion();
        //Step 2: compare the versions - we assume no admin is stupid enough to regress versions.
        detectCurrentVersions(System.getProperty("user.dir"));
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

    public void doUpdate() throws IOException{
        //Nothing to do here if the size was 0.
        if(remoteVersions.size() == 0) return;
        downloadFiles(remoteExecs);
        if (!remoteChecksums.containsKey(CORE_PACKAGE_MAIN_CLASS_NAME)) {

            // stop AppStarter timer
            AppStarter.getTimer().cancel();

            // Stop current process
            this.applicationProcess.destroy();

            if (this.applicationProcess.isAlive())
                this.applicationProcess.destroyForcibly();

            System.out.println("Murdered process with pid: " + AppStarter.getJamsPID());
            // delete old files
            remoteExecs.forEach((k, v) -> {
                log.info(remoteExecs.get(k));

                if (k.equals(CORE_PACKAGE_MAIN_CLASS_NAME)) {
                    File f = new File(System.getProperty("user.dir") + "/" + remoteExecs.get(k));
                    f.delete();
                    f = new File(System.getProperty("user.dir") + "/tmp/" + remoteExecs.get(k));
                    if (!f.renameTo(new File(System.getProperty("user.dir") + "/" + remoteExecs.get(k))))
                        log.warn("An error occurred while attempting to move the file!");
                    else
                        f.delete();
                } else {
                    File f = new File(System.getProperty("user.dir") + "/libs/" + remoteExecs.get(k));
                    f.delete();
                    f = new File(System.getProperty("user.dir") + "/tmp/" + remoteExecs.get(k));
                    if (!f.renameTo(new File(System.getProperty("user.dir") + "/libs/" + remoteExecs.get(k))))
                        log.warn("An error occurred while attempting to move the file!");
                    else
                        f.delete();
                }
            });

            // Finally, start main jar

            ProcessBuilder pb = AppStarter.startAccountManagementServer(parentArgs);
            pb.inheritIO();
            pb.directory(new File(System.getProperty("user.dir")));
            this.applicationProcess = pb.start();
            AppStarter.setJamsPID(this.applicationProcess.pid());
            //Start process check timer again
            AppStarter.setTimer(AppStarter.startProcessCheckTimer(20000, parentArgs));

            System.out.println("New PID: " + AppStarter.getJamsPID());
            System.out.println("Update complete. Now running newest version");

        } else
            System.out.println("An error occurred during the core package update process, the application has not been restarted.");

        // delete tmp folder
        try {
            FileUtils.deleteDirectory(System.getProperty("user.dir") + "/tmp/");
        } catch (IOException e) {
            log.warn("An error occurred while attempting to delete /tmp/ folder!");
        }
    }

    private static String checksum(String filepath) throws IOException {

        HashCode hash = com.google.common.io.Files
                .hash(new File(filepath), Hashing.md5());

        log.warn("Calculated md5: " + hash.toString());
        return hash.toString();
    }

    @Override
    public void run() {
        Timer timer = new Timer();
        // check if license is valid, then attempt SSL handshake with update server.
        try {
            System.out.println("Update timer started");
            TimerTask pollTask = new TimerTask() {
                @Override
                public void run() {
                    try {
                        loadLicense();
                        checkUpdate();
                        if(doUpdate.get()) {
                            doUpdate();
                        }
                    } catch (Exception e) {
                        System.out.println("Exception thrown when attempting to update! " + e.toString());
                    }
                }
            };
            timer.scheduleAtFixedRate(pollTask, 15000, UPDATE_INTERVAL);
        } catch (Exception e) {
            log.warn("error! " + e.toString());
        }
    }
}