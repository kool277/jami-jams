/*
 * Copyright (C) 2020-2024 by Savoir-faire Linux
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
package net.jami.jams.common.utils;

import net.jami.jams.common.updater.FileDescription;

import org.bouncycastle.util.encoders.Hex;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Random;
import java.util.Set;
import java.util.jar.Attributes;
import java.util.jar.JarEntry;
import java.util.jar.JarOutputStream;
import java.util.jar.Manifest;

class VersioningUtilsTest {

    @Test
    @Disabled
    public void testFileScan() {
        HashMap<String, FileDescription> res = VersioningUtils.checkVersion(null);
        Assertions.assertEquals(7, res.size(), "Incorrect number of versions detected!");
    }

    @Test
    public void testVersionsAndHashes(@TempDir Path dir) throws Exception {
        Path server = dir.resolve("jams-server.jar");
        Path lib = Files.createDirectory(dir.resolve("libs")).resolve("cryptoengine.jar");
        writeJar(server, "net.jami.jams.server.Server");
        writeJar(lib, null);
        Files.writeString(dir.resolve("broken.jar"), "not a jar");
        Files.writeString(dir.resolve("config.json"), "{}");

        HashMap<String, FileDescription> res = VersioningUtils.checkVersion(dir.toString());

        Assertions.assertEquals(Set.of("jams-server.jar", "cryptoengine.jar"), res.keySet());
        FileDescription description = res.get("jams-server.jar");
        Assertions.assertEquals("3.8", description.getVersion());
        Assertions.assertEquals("net.jami.jams.server.Server", description.getMainClass());
        Assertions.assertEquals(md5(server), description.getMd5hash());
        Assertions.assertEquals(md5(lib), res.get("cryptoengine.jar").getMd5hash());
    }

    // Bigger than the read buffer, so that the jar is hashed in several parts.
    private static void writeJar(Path path, String mainClass) throws IOException {
        Manifest manifest = new Manifest();
        Attributes attributes = manifest.getMainAttributes();
        attributes.put(Attributes.Name.MANIFEST_VERSION, "1.0");
        attributes.put(Attributes.Name.IMPLEMENTATION_VERSION, "3.8");
        if (mainClass != null) attributes.put(Attributes.Name.MAIN_CLASS, mainClass);
        byte[] data = new byte[200_000];
        new Random(path.hashCode()).nextBytes(data);
        try (JarOutputStream jar = new JarOutputStream(Files.newOutputStream(path), manifest)) {
            jar.putNextEntry(new JarEntry("data.bin"));
            jar.write(data);
        }
    }

    private static String md5(Path path) throws Exception {
        return Hex.toHexString(MessageDigest.getInstance("MD5").digest(Files.readAllBytes(path)));
    }
}
