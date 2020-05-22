package net.jami.jams.common.updater;

public interface AppUpdater {

    String getCurrentVersion();
    String getLatestVersion();
    boolean downloadUpdates();



}
