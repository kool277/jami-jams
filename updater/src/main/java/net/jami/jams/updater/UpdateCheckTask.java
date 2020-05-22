package net.jami.jams.updater;

import com.jsoniter.JsonIterator;
import com.jsoniter.any.Any;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;

import javax.net.ssl.HttpsURLConnection;
import java.net.URL;
import java.util.List;
import java.util.TimerTask;
import java.util.concurrent.atomic.AtomicBoolean;

import static net.jami.jams.updater.UpdateDaemon.UPDATE_SERVER_URI;

@Slf4j
public class UpdateCheckTask extends TimerTask {

    // private final List<String> files;
    private AtomicBoolean doUpdate = new AtomicBoolean(false);

    public UpdateCheckTask() {
        // this.files = files;
    }

    @Override
    public void run() {

        try {
            JAMSUpdater updater = new JAMSUpdater();
            updater.loadLicense();
            updater.checkUpdate();
            if(doUpdate.get()) {
                doUpdate();
            }
        } catch (Exception e) {
            System.out.println("Exception thrown when attempting to update! " + e.toString());
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
}
