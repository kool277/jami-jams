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
package launcher.loaders;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.updater.AppUpdater;
import net.jami.jams.common.utils.LibraryLoader;

import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
public class UpdaterLoader {

    public static AppUpdater loadUpdater(AtomicBoolean updateSignaler) {
        try {
            Class<?> cls = LibraryLoader.classLoader.loadClass("net.jami.jams.updater.JAMSUpdater");
            log.info("Updater service started...");
            return (AppUpdater) cls.getConstructor(AtomicBoolean.class).newInstance(updateSignaler);
        }
        catch (Exception e){
            log.error("Could not load update module...");
            return null;
        }
    }

}
