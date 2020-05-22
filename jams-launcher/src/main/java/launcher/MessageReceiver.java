package launcher;

import lombok.extern.slf4j.Slf4j;
import org.zeromq.ZMQ;

import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
public class MessageReceiver extends Thread {

    private ZMQ.Socket socket;
    private AtomicBoolean atomicBoolean;

    public MessageReceiver(ZMQ.Socket socket, AtomicBoolean atomicBoolean) {
        this.socket = socket;
        this.atomicBoolean = atomicBoolean;
    }

    @Override
    public void run() {
        while(true){
            try{
                String message = socket.recvStr();
                if(message.equals("DO-UPDATE")) atomicBoolean.set(true);
            }
            catch (Exception e){
                log.error("Some exception occurred on the message receiving thread, details {}!",e.getMessage());
            }
        }
    }
}
