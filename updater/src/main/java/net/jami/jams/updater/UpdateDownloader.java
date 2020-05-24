package net.jami.jams.updater;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.updater.FileDescription;
import net.jami.jams.common.utils.VersioningUtils;
import net.jami.jams.common.utils.X509Utils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContexts;

import javax.net.ssl.SSLContext;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.concurrent.atomic.AtomicBoolean;

import static net.jami.jams.updater.JAMSUpdater.UPDATE_SERVER_URL;


@Slf4j
public class UpdateDownloader {

    private SSLContext sslContext;
    private static final String KEYSTORE_TYPE = "JKS";
    private KeyStore trustStore;


    public UpdateDownloader() {
        try {
            InputStream is = UpdateCheckTask.class.getClassLoader().getResourceAsStream("oem/ca.crt");
            X509Certificate certificate = X509Utils.getCertificateFromPEMString(new String(is.readAllBytes()));
            trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
            trustStore.load(null, null);
            trustStore.setCertificateEntry("ca", certificate);
        }
        catch (Exception e){
            log.info("Could not load SFL's CA - this should not happen! detailed error: {}",e.getMessage());
        }
    }

    private void downloadFile(File tmpFolder,FileDescription fileDescription) throws Exception{
        HttpClient httpClient = HttpClients.custom().setSSLContext(sslContext).build();
        HttpResponse httpResponse = httpClient.execute(new HttpGet(UPDATE_SERVER_URL + "/updates/" + fileDescription.getFileName()));
        if(httpResponse.getStatusLine().getStatusCode() != 200) return;
        FileOutputStream fos = new FileOutputStream(tmpFolder.getPath() + "/" + fileDescription.getFileName());
        httpResponse.getEntity().writeTo(fos);
        fos.close();
    }


    //TODO: Download the files and dump them into a tmp folder.
    public boolean downloadFiles(HashMap<String, FileDescription> files){
        try {
            //We can perpetually reload this,it doesn't really harm anything.
            //Build the SSL context here, (this is fairly simple)
            KeyStore ks = KeyStore.getInstance(KEYSTORE_TYPE);
            ks.load(null);
            ks.setKeyEntry("licenses", JAMSUpdater.privateKey,"".toCharArray(),new Certificate[]{JAMSUpdater.certificate});
            sslContext = SSLContexts.custom().loadKeyMaterial(ks, "".toCharArray()).loadTrustMaterial(trustStore, null).build();
            //Try to download the files and store the to /tmp
            File tmpFolder = new File(System.getProperty("user.dir") + "/tmp/");
            if(!tmpFolder.mkdirs()){
                log.error("Could not create temporary folder to store the update files!");
                return false;
            }
            files.forEach((k,v) -> {
                try {
                    downloadFile(tmpFolder,v);
                }
                catch (Exception e){
                    log.error("Could not download a file with error {}",e.getMessage());
                }
            });
            //Check file checksums and trigger the update cycle itself - but this is already done in the outer function.
            HashMap<String,FileDescription> downloadedFileInfo = VersioningUtils.checkVersion(System.getProperty("user.dir") + "/tmp");
            AtomicBoolean checksumOk = new AtomicBoolean(true);
            files.forEach((k,v) ->{
                if(downloadedFileInfo.containsKey(k) && !downloadedFileInfo.get(k).getMd5hash().equals(v.getMd5hash())){
                    checksumOk.set(false);
                }

            });
            return checksumOk.get();
        }
        catch (Exception e){
            log.error("Could not check for updates with error: {}",e.getMessage());
            return false;
        }
    }


}
