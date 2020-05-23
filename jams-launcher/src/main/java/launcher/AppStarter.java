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
package launcher;

import launcher.loaders.ServerLoader;
import launcher.loaders.UpdaterLoader;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.updater.AppUpdater;
import net.jami.jams.common.utils.LibraryLoader;
import net.jami.jams.server.Server;

import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
public class AppStarter extends Thread {

    private final AtomicBoolean doUpdate = new AtomicBoolean(false);
    private Server server;
    private AppUpdater appUpdater;
    /**
     *  The launcher is essentially responsible of firing up the main application JAR.
     *  The problematic here is whenever we will fire up a JAR (but then we need to be able to
     *  kill and restart his PID, or whenever we fork via a main).
     */
    public static void main(String[] args) {
        //We also need to fork the updater, which is a bit trickier, basically we just need a signaling
        //system between both systems.
        AppStarter appStarter = new AppStarter();
        appStarter.start();
    }

    //How this works - once the JAMSUpdater has notified back upstread to do an update, we lockdown
    //and run the good old routine
    @Override
    public void run() {
        //TODO: Hack this a bit to get it to work better - passing arguments damnit.
        LibraryLoader.loadlibs(System.getProperty("user.dir"),AppStarter.class);
        appUpdater = UpdaterLoader.loadUpdater(doUpdate);
        server = ServerLoader.loadServer(appUpdater);
        while(true){
            try{
                synchronized (doUpdate){
                    doUpdate.wait();
                }
                if(doUpdate.get()){
                    Server.tomcatLauncher.stopTomcat();
                    //This will trigger a force reload of the lib.
                    LibraryLoader.loadlibs(System.getProperty("user.dir"),AppStarter.class);
                    server = ServerLoader.loadServer(appUpdater);
                    this.doUpdate.set(false);
                }
            }
            catch (Exception e){

            }
        }
    }
}
