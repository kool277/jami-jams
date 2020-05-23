package net.jami.jams.updater;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.updater.AppUpdater;

import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Getter
@Setter
public class JAMSUpdater extends Thread implements AppUpdater {

    private final AtomicBoolean updateAvailable = new AtomicBoolean(false);
    private final AtomicBoolean doUpdate;
    private final UpdateDownloader updateDownloader = new UpdateDownloader();

    public JAMSUpdater(AtomicBoolean doUpdate) {
        this.doUpdate = doUpdate;
        this.start();
        //As a mock I left this here, please remove it when this is done.
    }


    @Override
    public void run() {
        try {
            synchronized (this){
                this.wait(20_000);
            }
            this.doUpdate.set(true);
            synchronized (doUpdate) {
                doUpdate.notify();
            }
        }
        catch (Exception e){
            log.error("An error has occurred! {}",e.getMessage());
        }
    }

    @Override
    public String getLocalVersions() {
        return null;
    }

    @Override
    public String getRemoteVersions() {
        return null;
    }

    @Override
    public boolean downloadUpdates() {
        return updateDownloader.doUpdate();
    }
}
