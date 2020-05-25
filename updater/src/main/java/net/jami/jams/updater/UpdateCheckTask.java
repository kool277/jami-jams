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

import com.jsoniter.JsonIterator;
import com.jsoniter.any.Any;
import lombok.extern.slf4j.Slf4j;
import lombok.Getter;
import lombok.Setter;
import net.jami.jams.common.updater.FileDescription;
import net.jami.jams.common.utils.VersioningUtils;
import net.jami.jams.common.utils.X509Utils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;

import javax.net.ssl.HttpsURLConnection;
import java.net.URL;
import java.util.List;
import java.util.TimerTask;
import java.util.concurrent.atomic.AtomicBoolean;

import static net.jami.jams.updater.UpdateDaemon.UPDATE_SERVER_URI;
import org.apache.http.ssl.SSLContexts;
import javax.net.ssl.SSLContext;



@Slf4j
@Getter
@Setter
public class UpdateCheckTask extends TimerTask {

    private HashMap<String, FileDescription> remoteData = new HashMap<>();
    private HashMap<String, FileDescription> localData;
    private SSLContext sslContext;
    private volatile KeyStore trustStore;

    protected UpdateCheckTask() {
        try {
            InputStream is = UpdateCheckTask.class.getClassLoader().getResourceAsStream("oem/ca.crt");
            X509Certificate certificate = X509Utils.getCertificateFromPEMString(new String(is.readAllBytes()));
            trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
            trustStore.load(null, null);
            trustStore.setCertificateEntry("ca",certificate);
            //Inject the SSL Connection here for a first time.
            sslContext = SSLContexts.custom().loadTrustMaterial(trustStore, null).build();
        }
        catch (Exception e){
            log.error("Could not initialize the trust store with error {}",e.getMessage());
        }
    }

    @Override
    public void run() {
        try {
            //Get the local data
            localData = VersioningUtils.checkVersion(null);
            //Download the info from the remote server.
            getLatestVersion();
            localData.forEach((k,v) -> {
                if(remoteData.containsKey(k) && remoteData.get(k).compareTo(v) > 0){
                    log.info("Detected a new version on SFL servers!");
                    JAMSUpdater.updateAvailable.set(true);
                }
            });




        }
        catch (Exception e){
            log.error("Could not check for updates with error: {}",e.getMessage());
        }
    }

    // This reads a file on the server which contains some basic info
    // about what new versions of WHAT are available.
    private void getLatestVersion() {
        try {
            //Step 1: Download a file called versions.json
            HttpClient httpClient = HttpClients.custom().setSSLContext(sslContext).build();
            HttpResponse response = httpClient.execute(new HttpGet(UPDATE_SERVER_URL + "/versions.json"));
            //Step 2: Load the file into the hashmaps
            Any any = JsonIterator.deserialize(response.getEntity().getContent().readAllBytes());
            any.asMap().forEach((k, v) ->
                remoteData.put(v.get("filename").toString(),new FileDescription(
                        v.get("filename").toString(),
                        v.get("version").toString(),
                        v.get("md5").toString(),
                        k))

            );
        } catch (Exception e) {
            log.warn("Could not establish connection to JAMS Update Center with error: " + e.toString());
        }
    }

}
