package net.jami.jams.updater;

import net.jami.jams.common.updater.FileDescription;
import net.jami.jams.common.updater.FileRepository;
import net.jami.jams.common.utils.VersioningUtils;

import java.util.HashMap;

public class LocalVersionRepository implements FileRepository {

    @Override
    public HashMap<String, FileDescription> getFileVersions() {
        return VersioningUtils.checkVersion(null);
    }
}
