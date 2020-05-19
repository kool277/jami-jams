package net.jami.jams.server.startup;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.updater.AppUpdater;
import net.jami.jams.common.utils.LibraryLoader;

@Slf4j
public class UpdaterLoader {

    public static AppUpdater loadUpdater() {
        try {
            Class<?> cls = LibraryLoader.classLoader.loadClass("net.jami.jams.common.updater.AppUpdater");
            log.info("Updater service started...");
            return  (AppUpdater) cls.getConstructor().newInstance();
        }
        catch (Exception e){
            log.error("Could not load update module...");
            return null;
        }
    }

}
