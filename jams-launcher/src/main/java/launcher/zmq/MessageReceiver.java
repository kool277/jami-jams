package launcher.zmq;

import lombok.Getter;

import org.zeromq.ZMQ;

import java.util.concurrent.atomic.AtomicBoolean;

@Getter
public class MessageReceiver extends Thread {

    private final ZMQ.Socket socket;
    private final AtomicBoolean atomicBoolean;

    public MessageReceiver(ZMQ.Socket socket, AtomicBoolean atomicBoolean) {
        this.socket = socket;
        this.atomicBoolean = atomicBoolean;
    }

    @Override
    public void run() {
        while (true) {
            try {
                String message = socket.recvStr();
                if (message.equals("DO-UPDATE")) {
                    // Use wait-notify mechanism to avoid burning CPU cycles.
                    synchronized (atomicBoolean) {
                        atomicBoolean.set(true);
                        atomicBoolean.notify();
                    }
                }
            } catch (Exception e) {
                System.out.println("Some exception occurred!");
            }
        }
    }
}
