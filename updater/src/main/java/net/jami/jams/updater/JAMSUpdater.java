package net.jami.jams.updater;

import net.jami.jams.common.updater.AppUpdater;

public class JAMSUpdater implements AppUpdater {

    UpdateDownloader updateDownloader = new UpdateDownloader();

    public JAMSUpdater() {
    }

    @Override
    public String getCurrentVersion() {
        return null;
    }

    @Override
    public String getLatestVersion() {
        return null;
    }

    @Override
    public boolean downloadUpdates() {
        return updateDownloader.doUpdate();
    }
}
