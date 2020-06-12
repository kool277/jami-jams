package net.jami.jams.server.startup;

import java.io.File;
import java.io.FileInputStream;
import java.util.HashSet;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class PackageScanner {

    public static HashSet<String> getClasses() throws Exception {
        HashSet<String> classNames = new HashSet<>();
        ZipInputStream zip = new ZipInputStream(new FileInputStream(System.getProperty("user.dir") + File.separator + "jams-server.jar"));
        for (ZipEntry entry = zip.getNextEntry(); entry != null; entry = zip.getNextEntry()) {
            if (!entry.isDirectory() && entry.getName().endsWith(".class")) {
                // This ZipEntry represents a class. Now, what class does it represent?
                String className = entry.getName().replace('/', '.'); // including ".class"
                classNames.add(className.substring(0, className.length() - ".class".length()));
            }
        }
        return classNames;
    }
}
