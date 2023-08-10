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
package net.jami.jams.server.update;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import net.jami.jams.common.serialization.adapters.GsonFactory;
import net.jami.jams.common.updater.FileDescription;
import net.jami.jams.common.utils.VersioningUtils;
import net.jami.jams.common.utils.X509Utils;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContexts;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.security.KeyStore;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.TimerTask;

import javax.net.ssl.SSLContext;

@Slf4j
@Getter
@Setter
public class UpdateCheckTask extends TimerTask {

    private HashMap<String, FileDescription> remoteData = new HashMap<>();
    private HashMap<String, FileDescription> localData = new HashMap<>();
    private SSLContext sslContext;
    private volatile KeyStore trustStore;
    protected static volatile String UPDATE_SERVER_URI;

    private final Gson gson = GsonFactory.createGson();

    protected UpdateCheckTask() {
        try {
            InputStream is =
                    UpdateCheckTask.class.getClassLoader().getResourceAsStream("oem/ca.crt");
            X509Certificate certificate =
                    X509Utils.getCertificateFromPEMString(new String(is.readAllBytes()));
            trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
            trustStore.load(null, null);
            trustStore.setCertificateEntry("ca", certificate);

            is = UpdateCheckTask.class.getClassLoader().getResourceAsStream("oem/update.crt");
            certificate = X509Utils.getCertificateFromPEMString(new String(is.readAllBytes()));
            trustStore.setCertificateEntry("update", certificate);

            // Inject the SSL Connection here for a first time.
            sslContext = SSLContexts.custom().loadTrustMaterial(trustStore, null).build();

            // read config json
            InputStream input =
                    this.getClass().getClassLoader().getResourceAsStream("oem/config.json");
            Reader reader = new InputStreamReader(input);
            JsonObject jsonObject = gson.fromJson(reader, JsonObject.class);
            UPDATE_SERVER_URI = jsonObject.get("UPDATE_URL").getAsString();
        } catch (Exception e) {
            log.error("Could not initialize the trust store with error {}", e.getMessage());
        }
    }

    @Override
    public void run() {
        try {
            // Get the local data
            localData = VersioningUtils.checkVersion(null);
            // Download the info from the remote server.
            getLatestVersion();
            localData.forEach(
                    (k, v) -> {
                        if (remoteData.containsKey(k) && remoteData.get(k).compareTo(v) > 0) {
                            log.info("Detected a new version on SFL servers!");
                            JAMSUpdater.updateAvailable.set(true);
                        }
                    });
        } catch (Exception e) {
            log.error("Could not check for updates with error: {}", e.getMessage());
        }
    }

    // This reads a file on the server which contains some basic info
    // about what new versions of WHAT are available.
    private void getLatestVersion() {
        try {
            // Step 1: Download a file called versions.json
            HttpClient httpClient = HttpClients.custom().setSSLContext(sslContext).build();
            HttpResponse response =
                    httpClient.execute(new HttpGet(UPDATE_SERVER_URI + "/versions.json"));

            // Step 2: Load the file into the hashmaps
            byte[] bytes = response.getEntity().getContent().readAllBytes();
            JsonObject jsonObject = gson.fromJson(new String(bytes), JsonObject.class);

            jsonObject
                    .entrySet()
                    .forEach(
                            (entry) -> {
                                String key = entry.getKey();
                                JsonObject value = entry.getValue().getAsJsonObject();
                                String version = value.get("version").getAsString();
                                String filename = value.get("filename").getAsString();
                                String md5 = value.get("md5").getAsString();
                                remoteData.put(
                                        key, new FileDescription(filename, version, md5, key));
                            });
        } catch (Exception e) {
            log.warn("Could not establish connection to JAMS Update Center with error: " + e);
        }
    }
}
