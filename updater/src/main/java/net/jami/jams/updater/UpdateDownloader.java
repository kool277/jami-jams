/*
* Copyright (C) 2020 by Savoir-faire Linux
* Authors: William Enright <william.enright@savoirfairelinux.com>
*          Ndeye Anna Ndiaye <anna.ndiaye@savoirfairelinux.com>
*          Johnny Flores <johnny.flores@savoirfairelinux.com>
*          Mohammed Raza <mohammed.raza@savoirfairelinux.com>
*          Felix Sidokhine <felix.sidokhine@savoirfairelinux.com>
*
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
package net.jami.jams.updater;

import com.google.common.hash.HashCode;
import com.google.common.hash.Hashing;
import com.jsoniter.JsonIterator;
import com.jsoniter.any.Any;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.updater.FileDescription;
import net.jami.jams.common.utils.VersioningUtils;
import net.jami.jams.common.utils.X509Utils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContexts;

import javax.net.ssl.SSLContext;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.concurrent.atomic.AtomicBoolean;


@Slf4j
public class UpdateDownloader {

    private SSLSocketFactory sslSocketFactory;
    private Process applicationProcess;
    private SSLContext sslContext;
    private static final String KEYSTORE_TYPE = "JKS";
    private KeyStore trustStore;
    private static volatile String UPDATE_SERVER_URL;

    private HashMap<String, FileDescription> remoteChecksums = new HashMap<>();

    public UpdateDownloader() {
        try {
            InputStream input = this.getClass().getClassLoader().getResourceAsStream("oem/config.json");
            Any any = JsonIterator.deserialize(input.readAllBytes());
            UPDATE_SERVER_URL = any.get("UPDATE_URL").toString();

        } catch (IOException e) {
            log.warn("Missing OEM configuration! Please contact software developer");
            System.exit(-1);
        }
    }

    public boolean downloadFiles(HashMap<String, FileDescription> files) {
        //I know this contradicts my dogma, but this really would have been an overkill for this project,
        //I just claim that everything which is not core gets dumped to the lib directory.

        // temp folder for safe download and integrity check
        File tmpFolder = new File(System.getProperty("user.dir") + "/tmp/");
        tmpFolder.mkdirs();

        files.forEach((k, v) -> {
            try {
                HttpClient httpClient = HttpClients.custom().setSSLContext(sslContext).build();
                HttpResponse httpResponse = httpClient.execute(new HttpGet(UPDATE_SERVER_URL + "/updates/" + v.getFileName()));
                if (httpResponse.getStatusLine().getStatusCode() == 200) {
                    log.info(tmpFolder.getPath() + "/" + v.getFileName());
                    FileOutputStream fos = new FileOutputStream(tmpFolder.getPath() + "/" + v.getFileName());
                    httpResponse.getEntity().writeTo(fos);
                    fos.close();
                } else {
                    log.warn("The server declared an update but does not have the required files?!");
                }
            } catch (Exception e1) {
                log.warn("Could not download an update with error " + e1.toString());
            }
        });

        return true;
    }
}
