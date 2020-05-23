package launcher.loaders;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.updater.AppUpdater;
import net.jami.jams.common.utils.LibraryLoader;
import net.jami.jams.server.Server;

@Slf4j
public class ServerLoader {

    public static Server loadServer(AppUpdater appUpdater) {
        try {
            Class<?> cls = LibraryLoader.classLoader.loadClass("net.jami.jams.server.Server");
            log.info("Server found, starting......");
            return  (Server) cls.getConstructor(AppUpdater.class).newInstance(appUpdater);
        }
        catch (Exception e){
            log.error("Could not find and start the server with error {}",e.getCause().getClass());
            return null;
        }
    }
}
