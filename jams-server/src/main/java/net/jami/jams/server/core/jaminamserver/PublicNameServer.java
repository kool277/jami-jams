package net.jami.jams.server.core.jaminamserver;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.jami.NameServer;

import java.io.BufferedReader;
import java.net.HttpURLConnection;
import java.net.URL;

@Slf4j
public class PublicNameServer implements NameServer {

    private final String nameserverURI;

    public PublicNameServer(String nameserverURI) {
        this.nameserverURI = nameserverURI;
    }

    @Override
    public Integer registerName(String username) {
        try {
            URL url = new URL(nameserverURI+"/");
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            con.connect();
            return con.getResponseCode();
        }
        catch (Exception e) {
            return 500;
        }
    }

    @Override
    public String getAddressFromName(String usernmae) {
        try {
            URL url = new URL(nameserverURI+"/");
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
        }
        catch (Exception e){
            return null;
        }
        return null;
    }

    @Override
    public String getNameFromAddress(String address) {
        try {
            URL url = new URL(nameserverURI+"/");
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
        }
        catch (Exception e){
            return null;
        }
        return null;
    }
}
