package net.jami.jams.updater;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.updater.AppUpdater;
import net.jami.jams.common.updater.FileDescription;
import net.jami.jams.common.utils.VersioningUtils;

import java.security.PrivateKey;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.Timer;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Getter
@Setter
public class JAMSUpdater implements AppUpdater {

    public static final String UPDATE_SERVER_URL = "https://updates.jami.net";

    public static final AtomicBoolean updateAvailable = new AtomicBoolean(false);
    private final AtomicBoolean doUpdate;
    private final UpdateCheckTask updateCheckTask = new UpdateCheckTask();
    private final UpdateDownloader updateDownloader = new UpdateDownloader();
    private final Timer timer = new Timer();
    //These get written to from the server, so we set them to volatile for visibility purposes.
    public volatile static X509Certificate certificate;
    public volatile static PrivateKey privateKey;


    public JAMSUpdater(AtomicBoolean doUpdate) {
        this.doUpdate = doUpdate;
        timer.schedule(updateCheckTask,0,10_000);
    }

    @Override
    public HashMap<String, FileDescription> getLocalVersions() {
        return VersioningUtils.checkVersion(null);
    }

    @Override
    public HashMap<String,FileDescription> getRemoteVersions() {
        return updateCheckTask.getRemoteData();
    }

    @Override
    public boolean getUpdateAvailable() {
        return updateAvailable.get();
    }

    @Override
    public void setLicense(X509Certificate certificate, PrivateKey privateKey) {
        JAMSUpdater.certificate = certificate;
        JAMSUpdater.privateKey = privateKey;
    }

    @Override
    public void doUpdate() {
        //Some logic here about replacing the existing files.
        boolean res = updateDownloader.downloadFiles(getRemoteVersions());
        //Notify back up-stream to the launcher that we want the update to happen.
        if(res) {
            doUpdate.set(true);
            synchronized (doUpdate) {
                doUpdate.notify();
            }
        }
        else log.error("Could not perform update!");
    }
}
