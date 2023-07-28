package net.jami.jams.server.update;

import lombok.Getter;
import lombok.Setter;

import org.zeromq.SocketType;
import org.zeromq.ZMQ;

import java.util.concurrent.atomic.AtomicBoolean;

@Getter
@Setter
public class UpdateInterface extends Thread {

    private AtomicBoolean updateAvailable = new AtomicBoolean(false);
    private volatile String versions;
    private ZMQ.Context context = ZMQ.context(1);
    private ZMQ.Socket sender = context.socket(SocketType.REQ);
    private ZMQ.Socket receiver = context.socket(SocketType.SUB);

    public UpdateInterface() {
        receiver.connect("tcp://localhost:4572");
        sender.connect("tcp://localhost:4573");
        receiver.subscribe("UPDATE");
        this.start();
    }

    public void approveUpdate() {
        sender.send("DO-UPDATE");
    }

    @Override
    public void run() {
        while (true) {
            try {
                receiver.recv();
                updateAvailable.set(true);
                versions = receiver.recvStr();
            } catch (Exception e) {
                System.out.println(e);
            }
        }
    }
}
