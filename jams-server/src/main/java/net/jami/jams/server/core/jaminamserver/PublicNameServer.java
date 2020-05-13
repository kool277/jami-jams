package net.jami.jams.server.core.jaminamserver;

import com.jsoniter.JsonIterator;
import com.jsoniter.output.JsonStream;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.jami.NameLookupResponse;
import net.jami.jams.common.jami.NameRegistrationRequest;
import net.jami.jams.common.jami.NameServer;

import java.net.HttpURLConnection;
import java.net.URL;

@Slf4j
public class PublicNameServer implements NameServer {

    private final String nameserverURI;

    public PublicNameServer(String nameserverURI) {
        this.nameserverURI = nameserverURI;
    }

    @Override
    public Integer registerName(String username, NameRegistrationRequest nameRegistrationRequest) {
        try {
            URL url = new URL(nameserverURI+"/name/" + username);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setDoOutput(true);
            con.getOutputStream().write(JsonStream.serialize(nameRegistrationRequest).getBytes());
            return con.getResponseCode();
        }
        catch (Exception e) {
            return 500;
        }
    }

    @Override
    public NameLookupResponse getAddressFromName(String username) {
        try {
            URL url = new URL(nameserverURI+"/name/" + username);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            if(con.getResponseCode() == 200) {
                StringBuilder responseData = new StringBuilder();
                int respSize = Integer.parseInt(con.getHeaderField("Content-Length"));
                int currentSize = 0;
                while (currentSize < respSize) {
                    responseData.append((char) con.getInputStream().read());
                    currentSize++;
                }
                log.info("Reponse received from public nameserver {} ", responseData.toString());
                return JsonIterator.deserialize(responseData.toString(),NameLookupResponse.class);
            }
            return null;
        }
        catch (Exception e){
            log.info("An error occurred while querying the public nameserver {} ", e.toString());
            return null;
        }
    }

    @Override
    public String getNameFromAddress(String address) {
        try {
            URL url = new URL(nameserverURI+"/addr/" + address);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            if(con.getResponseCode() == 200) {
                StringBuilder responseData = new StringBuilder();
                int respSize = Integer.parseInt(con.getHeaderField("Content-Length"));
                int currentSize = 0;
                while (currentSize < respSize) {
                    responseData.append((char) con.getInputStream().read());
                    currentSize++;
                }
                log.info("Response received from public nameserver {} ",responseData.toString());
                return responseData.toString();
            }
            return null;
        }
        catch (Exception e){
            log.info("An error occurred while querying the public nameserver {} ",e.toString());
            return null;
        }
    }
}
