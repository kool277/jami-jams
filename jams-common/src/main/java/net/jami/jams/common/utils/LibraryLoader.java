package net.jami.jams.common.utils;

import lombok.extern.slf4j.Slf4j;
import org.apache.xbean.classloader.JarFileClassLoader;

import java.io.File;
import java.net.URL;
import java.util.ArrayList;

@Slf4j
public class LibraryLoader {

    public static JarFileClassLoader classLoader;

    public static void loadlibs(String libDir, Class parentClass){
        try {
            File dependencyDirectory = new File(libDir);
            File[] files = dependencyDirectory.listFiles();
            ArrayList<URL> urls = new ArrayList<>();
            assert files != null;
            for (int i = 0; i < files.length; i++) {
                if (files[i].getName().endsWith(".jar")) {
                    urls.add(files[i].toURI().toURL());
                    log.info("Successfully loaded the library " + files[i]);
                }
            }
            classLoader = new JarFileClassLoader("Scheduler CL" + System.currentTimeMillis(), urls.toArray(new URL[urls.size()]), parentClass.getClassLoader());
        }
        catch (Exception e){
            log.error("Errors occured while trying to load libraries...");
        }
    }
}
