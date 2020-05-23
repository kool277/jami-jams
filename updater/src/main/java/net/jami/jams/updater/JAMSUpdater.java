package net.jami.jams.updater;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.updater.AppUpdater;

import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Getter
@Setter
public class JAMSUpdater implements AppUpdater {

    private final AtomicBoolean updateAvailable = new AtomicBoolean(false);
    private final AtomicBoolean doUpdate;
    private final UpdateDownloader updateDownloader = new UpdateDownloader();

    public JAMSUpdater(AtomicBoolean doUpdate) {
        this.doUpdate = doUpdate;
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
