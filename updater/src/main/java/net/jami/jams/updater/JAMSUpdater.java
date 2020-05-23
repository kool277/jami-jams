package net.jami.jams.updater;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.updater.AppUpdater;
import net.jami.jams.common.updater.FileDescription;
import net.jami.jams.common.utils.VersioningUtils;

import java.util.HashMap;
import java.util.Timer;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Getter
@Setter
public class JAMSUpdater implements AppUpdater {

    public static final AtomicBoolean updateAvailable = new AtomicBoolean(false);
    private final AtomicBoolean doUpdate;
    private final UpdateCheckTask updateCheckTask = new UpdateCheckTask();
    private final Timer timer = new Timer();

    public JAMSUpdater(AtomicBoolean doUpdate) {
        this.doUpdate = doUpdate;
        timer.schedule(new UpdateCheckTask(),0,150_000);
    }

    @Override
    public HashMap<String, FileDescription> getLocalVersions() {
        return VersioningUtils.checkVersion(null);
    }

    @Override
    public HashMap<String,FileDescription> getRemoteVersions() {
        return null;
    }

    @Override
    public boolean getUpdateAvailable() {
        return updateAvailable.get();
    }

    @Override
    public void setLicense() {
        //Trigger reading the license from disk.
    }

    @Override
    public void doUpdate() {
        //Some logic here about replacing the existing files.


        //Notify back up-stream to the launcher that we want the update to happen.
        doUpdate.set(true);
        synchronized (doUpdate){
            doUpdate.notify();
        }
    }
}
