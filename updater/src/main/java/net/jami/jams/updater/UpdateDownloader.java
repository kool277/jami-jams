package net.jami.jams.updater;

import lombok.extern.slf4j.Slf4j;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import java.net.URL;

import static net.jami.jams.updater.UpdateDaemon.UPDATE_SERVER_URI;
import static net.jami.jams.updater.UpdateDaemon.updateFiles;

@Slf4j
public class UpdateDownloader {

    private SSLSocketFactory sslSocketFactory;

    //returns the activation status of the server.
    public boolean getActivationStatus(){
        return loadLicense();
    }


    public boolean doUpdate(){
        try {
            if (!loadLicense()) {
                log.warn("This server does not have a valid license, no files will be download and no update" +
                        " will take place...");
                return false;
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
                    updateFiles.remove(file);
                    log.info("Successfully downloaded file...");
                } else {
                    log.info("An error has occurred while trying to download a file: {} ", con.getResponseCode());
                    return false;
                }
            }
            return true;
        }
        catch (Exception e){
            log.error("Could not check for updates with error: {}",e.getMessage());
            return false;
        }
    }

    private boolean loadLicense(){
        try {
            //We assume the keystore already exists, because it gets created upon upload.
            //Basically just load the JKS keystore here.
            //TODO: Load keystore from file.
            //Initialize the SSL context & load the SFL trust store.
            SSLContext sslContext = SSLContext.getInstance("SSL");
            //sslContext.init(kmf.getKeyManagers(), new SFLTrustStore[]{new SFLTrustStore()},null);
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
