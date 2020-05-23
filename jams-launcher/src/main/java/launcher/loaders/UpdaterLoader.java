package launcher.loaders;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.updater.AppUpdater;
import net.jami.jams.common.utils.LibraryLoader;

import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
public class UpdaterLoader {

    public static AppUpdater loadUpdater(AtomicBoolean updateSignaler) {
        try {
            Class<?> cls = LibraryLoader.classLoader.loadClass("net.jami.jams.updater.JAMSUpdater");
            log.info("Updater service started...");
            return (AppUpdater) cls.getConstructor(AtomicBoolean.class).newInstance(updateSignaler);
        }
        catch (Exception e){
            log.error("Could not load update module...");
            return null;
        }
    }

}
