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

<<<<<<< HEAD
import com.google.common.hash.HashCode;
import com.google.common.hash.Hashing;
import lombok.extern.slf4j.Slf4j;
import org.zeromq.ZMQ;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Timer;
import java.util.TimerTask;
import java.util.logging.log;
=======
import launcher.loaders.ServerLoader;
import launcher.loaders.UpdaterLoader;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.updater.AppUpdater;
import net.jami.jams.common.utils.LibraryLoader;
import net.jami.jams.server.Server;

import java.util.concurrent.atomic.AtomicBoolean;
>>>>>>> master

@Slf4j
public class AppStarter extends Thread {

    private static Process applicationProcess;
    private static long jamsPID;
    private static Timer timer;
    public static ZMQ.Context context = ZMQ.context(1);
    private final AtomicBoolean doUpdate = new AtomicBoolean(false);
    private Server server;
    private AppUpdater appUpdater;
    /**
     *  The launcher is essentially responsible of firing up the main application JAR.
     *  The problematic here is whenever we will fire up a JAR (but then we need to be able to
     *  kill and restart his PID, or whenever we fork via a main).
     */
    public static void main(String[] args) {
        timer = startProcessCheckTimer(5000, args);


        try {
            log.info("md5 for all packages: ");
            log.info("Core: " + checksum(System.getProperty("user.dir") + "/" + "jams-server.jar"));
            log.info("AD Connector: " + checksum(System.getProperty("user.dir") + "/libs/" + "ad-connector.jar"));
            log.info("LDAP Connector: " + checksum(System.getProperty("user.dir") + "/libs/" + "ldap-connector.jar"));
        } catch (IOException e) {
            e.printStackTrace();
        }

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("Shutting down...");
            if (applicationProcess != null)
                applicationProcess.destroy();
        }));
        startProcess(args);
    }

    public static Timer startProcessCheckTimer(long delay, String[] parentArgs) {
        TimerTask pollTask = new TimerTask() {
            @Override
            public void run() {
                // check if jams process is alive. If it's not, create another jams process and record it's pid.
                // Then keep monitoring.

                if (!isStillAlive(Long.toString(jamsPID))) {

                    try {
                        log.info("Process with pid: " + jamsPID + " found dead. Resurrecting...");
                        ProcessBuilder pb = startAccountManagementServer(parentArgs);

                        if (pb != null) {
                            pb.inheritIO();
                            pb.directory(new File(System.getProperty("user.dir")));
                            log.fine("Directory: " + pb.directory().getAbsolutePath());
                            applicationProcess = pb.start();
                        }

                        // keep pid to monitor in memory
                        if (applicationProcess.isAlive())
                            jamsPID = applicationProcess.pid();

                        log.info("New PID: " + jamsPID);
                    } catch (IOException e) {
                        log.severe("Exception thrown when attempting to startup jams process again!");
                    }
                }

            }
        };
        Timer timer = new Timer();
        timer.scheduleAtFixedRate(pollTask, delay,
                25000);

        return timer;
    }

    private static boolean isStillAlive(String pidStr) {
        String OS = System.getProperty("os.name").toLowerCase();
        String command;
        if (OS.indexOf("win") >= 0) {
            log.info("Check if pid " + pidStr + " is alive...");
            command = "cmd /c tasklist /FI \"PID eq " + pidStr + "\"";
        } else if (OS.indexOf("nix") >= 0 || OS.indexOf("nux") >= 0 || OS.contains("mac")) {
            log.info("Check if pid " + pidStr + " is alive...");
            command = "ps -p " + pidStr;
        } else {
            log.warning("Unsupported OS, failing gracefully... ");
            return false;
        }
        return isProcessIdRunning(pidStr, command); // call generic implementation
    }

    private static boolean isProcessIdRunning(String pid, String command) {
        try {
            Runtime rt = Runtime.getRuntime();
            Process pr = rt.exec(command);

            InputStreamReader isReader = new InputStreamReader(pr.getInputStream());
            BufferedReader bReader = new BufferedReader(isReader);
            String strLine;
            while ((strLine= bReader.readLine()) != null) {
                if (strLine.contains(pid)) {
                    return true;
=======
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
>>>>>>> master
                }
            }
            catch (Exception e){

<<<<<<< HEAD
            return false;
        } catch (Exception ex) {
            log.severe("Got exception using system command!");
            return false;
        }
    }

    private static void startProcess(String[] parentArgs) {
        try {
            ProcessBuilder pb = startAccountManagementServer(parentArgs);

            if (pb != null) {
                pb.inheritIO();
                pb.directory(new File(System.getProperty("user.dir")));
                log.info("Directory: " + pb.directory().getAbsolutePath());
                applicationProcess = pb.start();
            }

            // keep pid to monitor in memory
            if (applicationProcess.isAlive())
                jamsPID = applicationProcess.pid();

        }
        catch (NullPointerException | IOException e) {
            log.severe("An exception occurred! " + e.toString());
        }
        UpdateThread updateThread = new UpdateThread(applicationProcess, parentArgs);
        updateThread.start();
    }

    public static ProcessBuilder startAccountManagementServer(String[] parentArgs) {
        ProcessBuilder pb;

        switch(parentArgs.length) {
            case 1:
                pb = new ProcessBuilder("java", "-jar", "jams-server.jar",
                        parentArgs[0]);
                break;
            case 2:
                pb = new ProcessBuilder("java", "-jar", "jams-server.jar",
                        parentArgs[0], parentArgs[1]);
                break;
            case 3:
                pb = new ProcessBuilder("java", "-jar", "jams-server.jar",
                        parentArgs[0], parentArgs[1], parentArgs[2]);
                break;
            default:
                pb = new ProcessBuilder("java", "-jar", System.getProperty("user.dir") + File.separator + "jams-server.jar");
                break;
=======
            }
>>>>>>> master
        }
    }
}
