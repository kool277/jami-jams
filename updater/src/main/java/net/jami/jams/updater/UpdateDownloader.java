package net.jami.jams.updater;

import lombok.extern.slf4j.Slf4j;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;


@Slf4j
public class UpdateDownloader {

    private SSLSocketFactory sslSocketFactory;


    //TODO: Download the files and dump them into a tmp folder.
    public boolean downloadFiles(){
        try {
            //We can perpetually reload this,it doesn't really harm anything.
            //KeyStore ks = KeyStore.getInstance(KEYSTORE_TYPE);
            //ks.load(null);
            //ks.setKeyEntry("licenses", JAMSUpdater.privateKey,"".toCharArray(),new Certificate[]{JAMSUpdater.certificate});
            //sslContext = SSLContexts.custom().loadKeyMaterial(ks, "".toCharArray()).loadTrustMaterial(trustStore, null)
            //        .build();
            //Build the SSL context here, (this is fairly simple)

            //Try to download the files and store the to /tmp

            //Check file checksums.
            return true;
        }
        catch (Exception e){
            log.error("Could not check for updates with error: {}",e.getMessage());
            return false;
        }
    }


}
