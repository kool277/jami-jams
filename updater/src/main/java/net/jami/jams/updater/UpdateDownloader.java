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
