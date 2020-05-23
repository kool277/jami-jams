package net.jami.jams.updater;

import net.jami.jams.common.updater.FileDescription;
import net.jami.jams.common.updater.FileRepository;
import net.jami.jams.common.utils.VersioningUtils;

import java.io.File;
import java.util.HashMap;

public class UpdateVersionRepository implements FileRepository {

    @Override
    public HashMap<String, FileDescription> getFileVersions() {
        return VersioningUtils.checkVersion(System.getProperty("user.dir") + File.separator + "tmp");
    }
}
