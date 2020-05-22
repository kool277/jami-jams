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
