package launcher;
import lombok.Getter;
import lombok.Setter;
<<<<<<< Updated upstream
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContexts;
import org.codehaus.plexus.util.FileUtils;
import org.zeromq.SocketType;
import org.zeromq.ZMQ;

import java.io.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;

@Getter
@Setter
public class UpdateThread extends Thread {

    private String[] parentArgs;
    private Process applicationProcess;

    public UpdateThread(Process applicationProcess, String[] parentArgs) {
        System.out.println("Update thread created...");
        this.parentArgs = parentArgs;
        this.applicationProcess = applicationProcess;
    }

    @Override
    public void run() {
        UpdateDaemon timer = new UpdateDaemon();
        // check if license is valid, then attempt SSL handshake with update server.
        try {
            System.out.println("Update timer started");
            UpdateCheckTask pollTask = new UpdateCheckTask();
            timer.scheduleAtFixedRate(pollTask, 15000, UPDATE_INTERVAL);
        } catch (Exception e) {
            logger.warning("error! " + e.toString());
        }
    }
}