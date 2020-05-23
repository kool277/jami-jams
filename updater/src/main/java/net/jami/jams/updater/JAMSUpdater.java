package net.jami.jams.updater;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.updater.AppUpdater;
import org.zeromq.SocketType;
import org.zeromq.ZMQ;

import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
public class JAMSUpdater extends Thread implements AppUpdater {

    private static final String IFACE_TCP_SENDER = "tcp://localhost:4573";
    private static final String IFACE_TCP_SUBSCRIBER = "tcp://localhost:4572";
    private static final String SUBSCRIBER_TOPIC = "UPDATE";

    private final AtomicBoolean updateAvailable = new AtomicBoolean(false);
    private final ZMQ.Context context = ZMQ.context(1);
    private final ZMQ.Socket sender = context.socket(SocketType.REQ);
    private final ZMQ.Socket receiver = context.socket(SocketType.SUB);
    private final UpdateDownloader updateDownloader = new UpdateDownloader();

    public JAMSUpdater() {
        receiver.connect(IFACE_TCP_SUBSCRIBER);
        sender.connect(IFACE_TCP_SENDER);
        receiver.subscribe(SUBSCRIBER_TOPIC);
        this.start();
    }

    @Override
    public String getCurrentVersion() {
        return null;
    }

    @Override
    public String getLatestVersion() {
        return null;
    }

    @Override
    public boolean downloadUpdates() {
        return updateDownloader.doUpdate();
    }

    @Override
    public void run() {
        while(true){
            try{
                receiver.recv();
                updateAvailable.set(true);
            }
            catch (Exception e){
               log.error("An error has occured with details {}",e.getMessage());
            }
        }
    }
}
