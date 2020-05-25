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

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.updater.AppUpdater;
import net.jami.jams.common.updater.FileDescription;
import net.jami.jams.common.utils.VersioningUtils;

import java.security.PrivateKey;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.Timer;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Getter
@Setter
public class JAMSUpdater implements AppUpdater {

    public static final String UPDATE_SERVER_URL = "https://updates.jami.net";

    public static final AtomicBoolean updateAvailable = new AtomicBoolean(false);
    private final AtomicBoolean doUpdate;
    private final UpdateCheckTask updateCheckTask = new UpdateCheckTask();
    private final UpdateDownloader updateDownloader = new UpdateDownloader();
    private final Timer timer = new Timer();
    //These get written to from the server, so we set them to volatile for visibility purposes.
    public volatile static X509Certificate certificate;
    public volatile static PrivateKey privateKey;


    public JAMSUpdater(AtomicBoolean doUpdate) {
        this.doUpdate = doUpdate;
        timer.schedule(updateCheckTask,0,150_000);
    }

    @Override
    public HashMap<String, FileDescription> getLocalVersions() {
        return VersioningUtils.checkVersion(null);
    }

    @Override
    public HashMap<String,FileDescription> getRemoteVersions() {
        return updateCheckTask.getRemoteData();
    }

    @Override
    public boolean getUpdateAvailable() {
        return updateAvailable.get();
    }

    @Override
    public void setLicense(X509Certificate certificate, PrivateKey privateKey) {
        JAMSUpdater.certificate = certificate;
        JAMSUpdater.privateKey = privateKey;
    }

    @Override
    public void doUpdate() {
        //Some logic here about replacing the existing files.
        boolean res = updateDownloader.downloadFiles(getRemoteVersions());
        //Notify back up-stream to the launcher that we want the update to happen.
        if(res) {
            doUpdate.set(true);
            synchronized (doUpdate) {
                doUpdate.notify();
            }
        }
        else log.error("Could not perform update - the downloaded files may have been invalid!");
    }
}
