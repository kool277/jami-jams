package net.jami.jams.common.updater;

import java.util.HashMap;

public interface FileRepository {
    HashMap<String,FileDescription> getFileVersions();
}
