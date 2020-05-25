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

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.updater.FileDescription;
import net.jami.jams.common.utils.VersioningUtils;
import net.jami.jams.common.utils.X509Utils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContexts;

import javax.net.ssl.SSLContext;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.concurrent.atomic.AtomicBoolean;

import static net.jami.jams.updater.JAMSUpdater.UPDATE_SERVER_URL;


@Slf4j
public class UpdateDownloader {

    private SSLSocketFactory sslSocketFactory;
    private Process applicationProcess;
    private SSLContext sslContext;
    private static final String KEYSTORE_TYPE = "JKS";
    private KeyStore trustStore;

    private static volatile String CORE_PACKAGE_MAIN_CLASS_NAME;
    private static volatile String UPDATE_SERVER_URL;
    private static volatile Long UPDATE_INTERVAL;


    public UpdateDownloader() {
        try {
            InputStream input = this.getClass().getClassLoader().getResourceAsStream("oem/config.json");
            Any any = JsonIterator.deserialize(input.readAllBytes());
            CORE_PACKAGE_MAIN_CLASS_NAME = any.get("CORE_PACKAGE_MAIN_CLASS_NAME").toString();
            UPDATE_SERVER_URL = any.get("UPDATE_URL").toString();
            UPDATE_INTERVAL = any.get("UPDATE_INTERVAL").toLong();

        } catch (IOException e) {
            log.warn("Missing OEM configuration! Please contact software developer");
            System.exit(-1);
        }
    }

    public void downloadFiles(HashMap<String, String> files) { // (File tmpFolder,FileDescription fileDescription)
        //I know this contradicts my dogma, but this really would have been an overkill for this project,
        //I just claim that everything which is not core gets dumped to the lib directory.

        // temp folder for safe download and integrity check
        File tmpFolder = new File(System.getProperty("user.dir") + "/tmp/");
        tmpFolder.mkdirs();

        files.forEach((k, v) -> {
            try {
                HttpClient httpClient = HttpClients.custom().setSSLContext(sslContext).build();
                HttpResponse httpResponse = httpClient.execute(new HttpGet(UPDATE_SERVER_URL + "/updates/" + v));
                if (httpResponse.getStatusLine().getStatusCode() == 200) {
                    log.info(tmpFolder.getPath() + "/" + files.get(k));
                    FileOutputStream fos = new FileOutputStream(tmpFolder.getPath() + "/" + files.get(k));
                    if (k.equals(CORE_PACKAGE_MAIN_CLASS_NAME)) {
                        httpResponse.getEntity().writeTo(fos);
                        fos.close();

                        if (checksum(tmpFolder.getPath() + "/" + files.get(k)).equals(remoteChecksums.get(k))) {
                            log.info("Successfully downloaded the core package!");
                            remoteChecksums.remove(CORE_PACKAGE_MAIN_CLASS_NAME);
                        }

                    } else {
                        httpResponse.getEntity().writeTo(fos);
                        fos.close();

                        if (checksum(tmpFolder.getPath() + "/" + files.get(k)).equals(remoteChecksums.get(k))) {
                            log.info("Successfully downloaded a library package!");
                            remoteChecksums.remove(remoteChecksums.get(k));
                        }
                    }

                } else {
                    log.warn("The server declared an update but does not have the required files?!");
                }
            } catch (Exception e1) {
                log.warn("Could not download an update with error " + e1.toString());
            }
        });
    }

    private static String checksum(String filepath) throws IOException {

        HashCode hash = com.google.common.io.Files
                .hash(new File(filepath), Hashing.md5());

        log.warn("Calculated md5: " + hash.toString());
        return hash.toString();
    }


//    public void doUpdate() throws IOException {
//        //Nothing to do here if the size was 0.
//        if(remoteVersions.size() == 0) return;
//        downloadFiles(remoteExecs);
//        if (!remoteChecksums.containsKey(CORE_PACKAGE_MAIN_CLASS_NAME)) {
//
//            // stop AppStarter timer
//            AppStarter.getTimer().cancel();
//
//            // Stop current process
//            this.applicationProcess.destroy();
//
//            if (this.applicationProcess.isAlive())
//                this.applicationProcess.destroyForcibly();
//
//            System.out.println("Murdered process with pid: " + AppStarter.getJamsPID());
//            // delete old files
//            remoteExecs.forEach((k, v) -> {
//                log.info(remoteExecs.get(k));
//
//                if (k.equals(CORE_PACKAGE_MAIN_CLASS_NAME)) {
//                    File f = new File(System.getProperty("user.dir") + "/" + remoteExecs.get(k));
//                    f.delete();
//                    f = new File(System.getProperty("user.dir") + "/tmp/" + remoteExecs.get(k));
//                    if (!f.renameTo(new File(System.getProperty("user.dir") + "/" + remoteExecs.get(k))))
//                        log.warn("An error occurred while attempting to move the file!");
//                    else
//                        f.delete();
//                } else {
//                    File f = new File(System.getProperty("user.dir") + "/libs/" + remoteExecs.get(k));
//                    f.delete();
//                    f = new File(System.getProperty("user.dir") + "/tmp/" + remoteExecs.get(k));
//                    if (!f.renameTo(new File(System.getProperty("user.dir") + "/libs/" + remoteExecs.get(k))))
//                        log.warn("An error occurred while attempting to move the file!");
//                    else
//                        f.delete();
//                }
//            });
//
//            // Finally, start main jar
//
//            ProcessBuilder pb = AppStarter.startAccountManagementServer(parentArgs);
//            pb.inheritIO();
//            pb.directory(new File(System.getProperty("user.dir")));
//            this.applicationProcess = pb.start();
//            AppStarter.setJamsPID(this.applicationProcess.pid());
//            //Start process check timer again
//            AppStarter.setTimer(AppStarter.startProcessCheckTimer(20000, parentArgs));
//
//            System.out.println("New PID: " + AppStarter.getJamsPID());
//            System.out.println("Update complete. Now running newest version");
//
//        } else
//            System.out.println("An error occurred during the core package update process, the application has not been restarted.");
//
//        // delete tmp folder
//        try {
//            FileUtils.deleteDirectory(System.getProperty("user.dir") + "/tmp/");
//        } catch (IOException e) {
//            log.warn("An error occurred while attempting to delete /tmp/ folder!");
//
//            InputStream is = UpdateCheckTask.class.getClassLoader().getResourceAsStream("oem/ca.crt");
//            X509Certificate certificate = X509Utils.getCertificateFromPEMString(new String(is.readAllBytes()));
//            trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
//            trustStore.load(null, null);
//            trustStore.setCertificateEntry("ca", certificate);
//        }
//        catch (Exception e){
//            log.info("Could not load SFL's CA - this should not happen! detailed error: {}",e.getMessage());
//        }
//    }

    private void downloadFile(File tmpFolder,FileDescription fileDescription) throws Exception{
        HttpClient httpClient = HttpClients.custom().setSSLContext(sslContext).build();
        HttpResponse httpResponse = httpClient.execute(new HttpGet(UPDATE_SERVER_URL + "/updates/" + fileDescription.getFileName()));
        if(httpResponse.getStatusLine().getStatusCode() != 200) return;
        FileOutputStream fos = new FileOutputStream(tmpFolder.getPath() + "/" + fileDescription.getFileName());
        httpResponse.getEntity().writeTo(fos);
        fos.close();
    }


    //TODO: Download the files and dump them into a tmp folder.
//    public boolean downloadFiles(HashMap<String, FileDescription> files){
//        try {
//            //We can perpetually reload this,it doesn't really harm anything.
//            //Build the SSL context here, (this is fairly simple)
//            KeyStore ks = KeyStore.getInstance(KEYSTORE_TYPE);
//            ks.load(null);
//            ks.setKeyEntry("licenses", JAMSUpdater.privateKey,"".toCharArray(),new Certificate[]{JAMSUpdater.certificate});
//            sslContext = SSLContexts.custom().loadKeyMaterial(ks, "".toCharArray()).loadTrustMaterial(trustStore, null).build();
//            //Try to download the files and store the to /tmp
//            File tmpFolder = new File(System.getProperty("user.dir") + "/tmp/");
//            if(!tmpFolder.mkdirs()){
//                log.error("Could not create temporary folder to store the update files!");
//                return false;
//            }
//            files.forEach((k,v) -> {
//                try {
//                    downloadFile(tmpFolder,v);
//                }
//                catch (Exception e){
//                    log.error("Could not download a file with error {}",e.getMessage());
//                }
//            });
//            //Check file checksums and trigger the update cycle itself - but this is already done in the outer function.
//            HashMap<String,FileDescription> downloadedFileInfo = VersioningUtils.checkVersion(System.getProperty("user.dir") + "/tmp");
//            AtomicBoolean checksumOk = new AtomicBoolean(true);
//            files.forEach((k,v) ->{
//                if(downloadedFileInfo.containsKey(k) && !downloadedFileInfo.get(k).getMd5hash().equals(v.getMd5hash())){
//                    checksumOk.set(false);
//                }
//
//            });
//            return checksumOk.get();
//        }
//        catch (Exception e){
//            log.error("Could not check for updates with error: {}",e.getMessage());
//            return false;
//        }
//    }


}
