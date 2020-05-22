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
        Manifest manifest = jar.getManifest();
        resp = manifest.getMainAttributes().getValue("Implementation-Version");
        System.out.println("Found version: " + resp);
        return resp;
    }
}
