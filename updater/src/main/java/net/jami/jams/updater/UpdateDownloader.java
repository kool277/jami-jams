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
            return true;
        }
        catch (Exception e){
            log.error("Could not check for updates with error: {}",e.getMessage());
            return false;
        }
    }


}
