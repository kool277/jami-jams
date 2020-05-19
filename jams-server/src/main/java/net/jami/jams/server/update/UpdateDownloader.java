package net.jami.jams.server.update;

import lombok.extern.slf4j.Slf4j;

import javax.net.ssl.*;
import java.io.FileOutputStream;
import java.net.URL;
import java.security.KeyStore;

import static net.jami.jams.server.update.UpdateDaemon.UPDATE_SERVER_URI;

@Slf4j
public class UpdateDownloader {

    private SSLSocketFactory sslSocketFactory;

    public void downloadUpdate(){
        try {
            if (!loadLicense()) {
                log.warn("This server does not have a valid license, no files will be download and no update" +
                        " will take place...");
                return;
            }
            for(String file : UpdateDaemon.updateFiles) {
                URL url = new URL(UPDATE_SERVER_URI);
                HttpsURLConnection con = (HttpsURLConnection) url.openConnection();
                con.setSSLSocketFactory(sslSocketFactory);
                con.setRequestMethod("GET");
                if (con.getResponseCode() == 200) {
                    StringBuilder responseData = new StringBuilder();
                    int respSize = Integer.parseInt(con.getHeaderField("Content-Length"));
                    int currentSize = 0;
                    while (currentSize < respSize) {
                        responseData.append((char) con.getInputStream().read());
                        currentSize++;
                    }
                    log.info("Succesfully downloaded file...");
                } else {
                    log.info("An error has occurred while trying to download a file: {} ", con.getResponseCode());
                }
            }
        }
        catch (Exception e){
            log.error("Could not check for updates with error: {}",e.getMessage());
        }
    }

    private boolean loadLicense(){
        try {
            KeyStore ks = KeyStore.getInstance(KeyStore.getDefaultType());
            ks.load(null, null);
            char[] password = "changeit".toCharArray();
            ks.load(null, password);

            //Set the license.
            ks.setKeyEntry("license",null,null);
            KeyManagerFactory kmf = KeyManagerFactory.getInstance("SunX509");
            kmf.init(ks,"".toCharArray());

            //Initialize the SSL context & load the SFL trust store.
            SSLContext sslContext = SSLContext.getInstance("SSL");
            sslContext.init(kmf.getKeyManagers(), new SFLTrustStore[]{new SFLTrustStore()},null);
            log.info("License loaded successfully!");
            sslSocketFactory = sslContext.getSocketFactory();
            return true;
        }
        catch (Exception e){
            log.error("An error occurred while trying to load the license: {}",e.getMessage());
            return false;
        }
    }


}
