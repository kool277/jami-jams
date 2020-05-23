package net.jami.jams.common.utils;

import lombok.extern.slf4j.Slf4j;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.jar.JarFile;

@Slf4j
public class LicenseUtils {

    private static final String IMPLEMENTATION_VERSION_FIELD = "Implementation-Version";

    public static HashMap<String,String> checkVersion() {
        try {
            HashMap<String,String> res = new HashMap<>();
            ArrayList<Path> files = new ArrayList<>();
            Files.walk(Paths.get(System.getProperty("user.dir"))).filter(Files::isRegularFile).forEach(files::add);
            files.forEach( e ->{
                if(e.endsWith(".jar")){
                    try {
                        String version = new JarFile(e.toFile()).getManifest().getMainAttributes().getValue(IMPLEMENTATION_VERSION_FIELD);
                        res.put(e.toString(),version);
                        log.info("Found version {} of {}",e.toString(),version);
                    }
                    catch (Exception e1){
                        log.error("Could detect version for file with error {}",e1.getMessage());
                    }
                }
            } );
            return res;
        }
        catch (Exception e){
            log.error("An error has occurred while trying to list file versions {}",e.getMessage());
            return null;
        }
    }
}
