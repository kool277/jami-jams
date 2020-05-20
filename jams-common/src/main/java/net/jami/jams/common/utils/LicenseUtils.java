package net.jami.jams.common.utils;


import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Enumeration;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import java.util.jar.Manifest;

@Slf4j
public class LicenseUtils {


    public static String checkVersion(String destinationDir, String jarPath) throws IOException {
        String resp = "";
        File file = new File(jarPath);
        JarFile jar = new JarFile(file);

        // first get all directories,
        // then make those directory on the destination Path
        for (Enumeration<JarEntry> enums = jar.entries(); enums.hasMoreElements(); ) {
            JarEntry entry = (JarEntry) enums.nextElement();

            String fileName = destinationDir + File.separator + entry.getName();
            File f = new File(fileName);

            if (fileName.endsWith("/")) {
                f.mkdirs();
            }
        }

        //now create all files
        for (Enumeration<JarEntry> enums = jar.entries(); enums.hasMoreElements(); ) {
            JarEntry entry = (JarEntry) enums.nextElement();
            if (entry.toString().contains("META-INF/MANIFEST.MF")) {
                String fileName = destinationDir + File.separator + entry.getName();
                File f = new File(fileName);

                if (!fileName.endsWith("/")) {
                    InputStream is = jar.getInputStream(entry);
                    FileOutputStream fos = new FileOutputStream(f);

                    // write contents of 'is' to 'fos'
                    while (is.available() > 0) {
                        fos.write(is.read());
                    }

                    fos.close();
                    is.close();
                }
            }
        }

        String manifestPath = destinationDir + "/META-INF/MANIFEST.MF";
        Manifest manifest = new Manifest(new URL("file:///" + manifestPath).openStream());
        resp = manifest.getMainAttributes().getValue("Implementation-Version");
        return resp;
    }
}
