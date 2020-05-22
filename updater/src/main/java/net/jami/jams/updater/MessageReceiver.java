package net.jami.jams.updater;

import org.zeromq.ZMQ;

import java.util.concurrent.atomic.AtomicBoolean;

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
                System.out.println("Some exception occurred!");
            }
        }
    }
}
