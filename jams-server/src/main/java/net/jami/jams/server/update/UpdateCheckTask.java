package net.jami.jams.server.update;

import lombok.extern.slf4j.Slf4j;

import javax.net.ssl.HttpsURLConnection;
import java.net.URL;
import java.util.List;
import java.util.TimerTask;

import static net.jami.jams.server.update.UpdateDaemon.UPDATE_SERVER_URI;

@Slf4j
public class UpdateCheckTask extends TimerTask {

    private final List<String> files;

    protected UpdateCheckTask(List<String> files) {
        this.files = files;
    }

    @Override
    public void run() {
        try {
            URL url = new URL(UPDATE_SERVER_URI);
            HttpsURLConnection con = (HttpsURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            if (con.getResponseCode() == 200) {
                StringBuilder responseData = new StringBuilder();
                int respSize = Integer.parseInt(con.getHeaderField("Content-Length"));
                int currentSize = 0;
                while (currentSize < respSize) {
                    responseData.append((char) con.getInputStream().read());
                    currentSize++;
                }
                log.info("Response received from update server {} ",con.getResponseCode());
                //TODO: Populate the files which "need" to be downloaded.
            } else {
                log.info("An error has occurred while checking for an update: {} ", con.getResponseCode());
            }
        }
        catch (Exception e){
            log.error("Could not check for updates with error: {}",e.getMessage());
        }
    }
}
