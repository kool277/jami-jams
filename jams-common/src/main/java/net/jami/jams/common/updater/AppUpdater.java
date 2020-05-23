package net.jami.jams.common.updater;

import java.security.PrivateKey;
import java.security.cert.X509Certificate;
import java.util.HashMap;

public interface AppUpdater {

    HashMap<String,FileDescription> getLocalVersions();
    HashMap<String,FileDescription> getRemoteVersions();
    boolean getUpdateAvailable();
    void setLicense(X509Certificate certificate, PrivateKey privateKey);
    void doUpdate();

}
