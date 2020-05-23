package net.jami.jams.common.utils;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.updater.FileDescription;
import org.bouncycastle.util.encoders.Hex;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.jar.JarFile;

@Slf4j
public class VersioningUtils {

    private static final String IMPLEMENTATION_VERSION_FIELD = "Implementation-Version";
    private static final String MAIN_CLASS_FIELD = "Main-Class";
    private static MessageDigest messageDigest;

    static {
        try {
            messageDigest = MessageDigest.getInstance("MD5");
        }
        catch (Exception e){
            messageDigest = null;
        }
    }

    public static HashMap<String, FileDescription> checkVersion() {
        try {
            HashMap<String,FileDescription> res = new HashMap<>();
            ArrayList<Path> files = new ArrayList<>();
            Files.walk(Paths.get(System.getProperty("user.dir"))).filter(Files::isRegularFile).forEach(files::add);
            files.forEach( e ->{
                if(e.toString().endsWith(".jar")){
                    try {
                        JarFile file = new JarFile(e.toFile());
                        String version = file.getManifest().getMainAttributes().getValue(IMPLEMENTATION_VERSION_FIELD);
                        String className = file.getManifest().getMainAttributes().getValue(MAIN_CLASS_FIELD);
                        String md5 = Hex.toHexString(messageDigest.digest(Files.readAllBytes(e.toAbsolutePath())));
                        String[] arr = e.toString().split(File.separator);
                        res.put(arr[arr.length - 1],new FileDescription(arr[arr.length - 1],version,md5,className));
                        log.info("Found version {} of {}",version,e.toString());
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
