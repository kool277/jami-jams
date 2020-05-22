package net.jami.jams.updater;

import com.google.common.hash.HashCode;
import com.google.common.hash.Hashing;
import com.jsoniter.JsonIterator;
import com.jsoniter.any.Any;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContexts;
import org.codehaus.plexus.util.FileUtils;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import java.io.*;
import java.util.HashMap;

@Slf4j
public class UpdateDownloader {
    private SSLSocketFactory sslSocketFactory;
    private SSLContext sslContext = null;
    private Process applicationProcess;


    private static volatile String CORE_PACKAGE_MAIN_CLASS_NAME;
    private static volatile String UPDATE_SERVER_URL;
    private static volatile Long UPDATE_INTERVAL;


    public UpdateDownloader() {
        try {
            InputStream input = this.getClass().getClassLoader().getResourceAsStream("oem/config.json");
            Any any = JsonIterator.deserialize(input.readAllBytes());
            CORE_PACKAGE_MAIN_CLASS_NAME = any.get("CORE_PACKAGE_MAIN_CLASS_NAME").toString();
            UPDATE_SERVER_URL = any.get("UPDATE_URL").toString();
            UPDATE_INTERVAL = any.get("UPDATE_INTERVAL").toLong();

        } catch (IOException e) {
            log.warn("Missing OEM configuration! Please contact software developer");
            System.exit(-1);
        }
    }

    public void downloadFiles(HashMap<String, String> files) {
        //I know this contradicts my dogma, but this really would have been an overkill for this project,
        //I just claim that everything which is not core gets dumped to the lib directory.

        // temp folder for safe download and integrity check
        File tmpFolder = new File(System.getProperty("user.dir") + "/tmp/");
        tmpFolder.mkdirs();

        files.forEach((k, v) -> {
            try {
                HttpClient httpClient = HttpClients.custom().setSSLContext(sslContext).build();
                HttpResponse httpResponse = httpClient.execute(new HttpGet(UPDATE_SERVER_URL + "/updates/" + v));
                if (httpResponse.getStatusLine().getStatusCode() == 200) {
                    log.info(tmpFolder.getPath() + "/" + files.get(k));
                    FileOutputStream fos = new FileOutputStream(tmpFolder.getPath() + "/" + files.get(k));
                    if (k.equals(CORE_PACKAGE_MAIN_CLASS_NAME)) {
                        httpResponse.getEntity().writeTo(fos);
                        fos.close();

                        if (checksum(tmpFolder.getPath() + "/" + files.get(k)).equals(remoteChecksums.get(k))) {
                            log.info("Successfully downloaded the core package!");
                            remoteChecksums.remove(CORE_PACKAGE_MAIN_CLASS_NAME);
                        }

                    } else {
                        httpResponse.getEntity().writeTo(fos);
                        fos.close();

                        if (checksum(tmpFolder.getPath() + "/" + files.get(k)).equals(remoteChecksums.get(k))) {
                            log.info("Successfully downloaded a library package!");
                            remoteChecksums.remove(remoteChecksums.get(k));
                        }
                    }

                } else {
                    log.warn("The server declared an update but does not have the required files?!");
                }
            } catch (Exception e1) {
                log.warn("Could not download an update with error " + e1.toString());
            }
        });
    }

    private static String checksum(String filepath) throws IOException {

        HashCode hash = com.google.common.io.Files
                .hash(new File(filepath), Hashing.md5());

        log.warn("Calculated md5: " + hash.toString());
        return hash.toString();
    }


    public void doUpdate() throws IOException {
        //Nothing to do here if the size was 0.
        if(remoteVersions.size() == 0) return;
        downloadFiles(remoteExecs);
        if (!remoteChecksums.containsKey(CORE_PACKAGE_MAIN_CLASS_NAME)) {

            // stop AppStarter timer
            AppStarter.getTimer().cancel();

            // Stop current process
            this.applicationProcess.destroy();

            if (this.applicationProcess.isAlive())
                this.applicationProcess.destroyForcibly();

            System.out.println("Murdered process with pid: " + AppStarter.getJamsPID());
            // delete old files
            remoteExecs.forEach((k, v) -> {
                log.info(remoteExecs.get(k));

                if (k.equals(CORE_PACKAGE_MAIN_CLASS_NAME)) {
                    File f = new File(System.getProperty("user.dir") + "/" + remoteExecs.get(k));
                    f.delete();
                    f = new File(System.getProperty("user.dir") + "/tmp/" + remoteExecs.get(k));
                    if (!f.renameTo(new File(System.getProperty("user.dir") + "/" + remoteExecs.get(k))))
                        log.warn("An error occurred while attempting to move the file!");
                    else
                        f.delete();
                } else {
                    File f = new File(System.getProperty("user.dir") + "/libs/" + remoteExecs.get(k));
                    f.delete();
                    f = new File(System.getProperty("user.dir") + "/tmp/" + remoteExecs.get(k));
                    if (!f.renameTo(new File(System.getProperty("user.dir") + "/libs/" + remoteExecs.get(k))))
                        log.warn("An error occurred while attempting to move the file!");
                    else
                        f.delete();
                }
            });

            // Finally, start main jar

            ProcessBuilder pb = AppStarter.startAccountManagementServer(parentArgs);
            pb.inheritIO();
            pb.directory(new File(System.getProperty("user.dir")));
            this.applicationProcess = pb.start();
            AppStarter.setJamsPID(this.applicationProcess.pid());
            //Start process check timer again
            AppStarter.setTimer(AppStarter.startProcessCheckTimer(20000, parentArgs));

            System.out.println("New PID: " + AppStarter.getJamsPID());
            System.out.println("Update complete. Now running newest version");

        } else
            System.out.println("An error occurred during the core package update process, the application has not been restarted.");

        // delete tmp folder
        try {
            FileUtils.deleteDirectory(System.getProperty("user.dir") + "/tmp/");
        } catch (IOException e) {
            log.warn("An error occurred while attempting to delete /tmp/ folder!");
        }
    }


}
