package launcher;

import com.google.common.hash.HashCode;
import com.google.common.hash.Hashing;
import org.zeromq.ZMQ;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Timer;
import java.util.TimerTask;
import java.util.logging.Logger;

public class AppStarter extends Thread {

    private static Process applicationProcess;
    private static long jamsPID;
    private static Timer timer;
    private final static Logger logger = Logger.getLogger(AppStarter.class.getName());
    public static ZMQ.Context context = ZMQ.context(1);


    /**
     *  The launcher is essentially responsible of firing up the main application JAR.
     *  The problematic here is whenever we will fire up a JAR (but then we need to be able to
     *  kill and restart his PID, or whenever we fork via a main).
     */
    public static void main(String[] args) {
        timer = startProcessCheckTimer(5000, args);


        try {
            logger.info("md5 for all packages: ");
            logger.info("Core: " + checksum(System.getProperty("user.dir") + "/" + "jams-server.jar"));
            logger.info("AD Connector: " + checksum(System.getProperty("user.dir") + "/libs/" + "ad-connector.jar"));
            logger.info("HSQL Connector: " + checksum(System.getProperty("user.dir") + "/libs/" + "hsqlconnector.jar"));
            logger.info("LDAP Connector: " + checksum(System.getProperty("user.dir") + "/libs/" + "ldap-connector.jar"));
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
                        logger.info("Process with pid: " + jamsPID + " found dead. Resurrecting...");
                        ProcessBuilder pb = startAccountManagementServer(parentArgs);

                        if (pb != null) {
                            pb.inheritIO();
                            pb.directory(new File(System.getProperty("user.dir")));
                            logger.fine("Directory: " + pb.directory().getAbsolutePath());
                            applicationProcess = pb.start();
                        }

                        // keep pid to monitor in memory
                        if (applicationProcess.isAlive())
                            jamsPID = applicationProcess.pid();

                        logger.info("New PID: " + jamsPID);
                    } catch (IOException e) {
                        logger.severe("Exception thrown when attempting to startup jams process again!");
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
            logger.info("Check if pid " + pidStr + " is alive...");
            command = "cmd /c tasklist /FI \"PID eq " + pidStr + "\"";
        } else if (OS.indexOf("nix") >= 0 || OS.indexOf("nux") >= 0 || OS.contains("mac")) {
            logger.info("Check if pid " + pidStr + " is alive...");
            command = "ps -p " + pidStr;
        } else {
            logger.warning("Unsupported OS, failing gracefully... ");
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
                }
            }

            return false;
        } catch (Exception ex) {
            logger.severe("Got exception using system command!");
            return false;
        }
    }

    private static void startProcess(String[] parentArgs) {
        try {
            ProcessBuilder pb = startAccountManagementServer(parentArgs);

            if (pb != null) {
                pb.inheritIO();
                pb.directory(new File(System.getProperty("user.dir")));
                logger.info("Directory: " + pb.directory().getAbsolutePath());
                applicationProcess = pb.start();
            }

            // keep pid to monitor in memory
            if (applicationProcess.isAlive())
                jamsPID = applicationProcess.pid();

        }
        catch (NullPointerException | IOException e) {
            logger.severe("An exception occurred! " + e.toString());
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
        }

        return pb;
    }

    private static String checksum(String filepath) throws IOException {

        HashCode hash = com.google.common.io.Files
                .hash(new File(filepath), Hashing.md5());

        return hash.toString();
    }


    public static Timer getTimer() { return timer; }

    public static void setTimer(Timer timer) { AppStarter.timer = timer; }

    public static long getJamsPID() { return jamsPID; }

    public static void setJamsPID(long jamsPID) { AppStarter.jamsPID = jamsPID; }
}
