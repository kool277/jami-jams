package net.jami.jams.common.updater;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;

@Getter
@Setter
public class FullSystemStatusResponse {

    private HashMap<String,FileDescription> localVersions;
    private HashMap<String, FileDescription> remoteVersions;
    private Boolean updateAvailable;

}
