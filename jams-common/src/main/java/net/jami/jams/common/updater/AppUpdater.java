package net.jami.jams.common.updater;

import java.util.HashMap;

public interface AppUpdater {

    HashMap<String,FileDescription> getLocalVersions();
    HashMap<String,FileDescription> getRemoteVersions();
    boolean getUpdateAvailable();
    void setLicense();
    void doUpdate();

}
