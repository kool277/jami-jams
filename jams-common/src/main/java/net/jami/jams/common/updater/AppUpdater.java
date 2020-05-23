package net.jami.jams.common.updater;

public interface AppUpdater {

    String getLocalVersions();
    String getRemoteVersions();
    boolean downloadUpdates();

}
