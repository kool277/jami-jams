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
package net.jami.jams.authmodule;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.jami.NameRegistrationRequest;
import net.jami.jams.common.jami.NameServer;
import net.jami.jams.common.objects.roots.X509Fields;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.dht.DeviceReceiptGenerator;
import net.jami.jams.dht.ETHAddressGenerator;

import static net.jami.jams.authmodule.UserAuthenticationModule.certificateAuthority;
import static net.jami.jams.authmodule.UserAuthenticationModule.datastore;

@Slf4j
public class RegisterUserFlow {

    //Get the CA, sign, return the Jami ID.
    public static boolean createUser(User user, NameServer nameServer){
        //This generates the X509 Fields we need.
        user.setX509Fields(new X509Fields());
        user.getX509Fields().setCommonName(user.getUsername());
        user = certificateAuthority.getSignedCertificate(user);
        String[] ethKeyPair = null;
        while(ethKeyPair == null){
            ethKeyPair = ETHAddressGenerator.generateAddress();
        }
        user.setEthAddress(ethKeyPair[0]);
        user.setEthKey(ethKeyPair[1]);
        user.setJamiId(DeviceReceiptGenerator.generateJamiId(user));
        //Didn't exactly plan on this happening here, but this is the only place we actually need it.
        //Given an interface of NameServer, we need to enroll the user or decline the enrollement before
        //storing him
        NameRegistrationRequest nameRegistrationRequest = new NameRegistrationRequest();
        nameRegistrationRequest.setOwner(ethKeyPair[0]);
        nameRegistrationRequest.setAddr(user.getJamiId());
        if(nameServer != null && nameServer.registerName(user.getUsername(), nameRegistrationRequest ) != 200){
           return false;
        }
        datastore.getUserDao().storeObject(user);
        log.info("Create the user " + user.getUsername() + " because he did not exist before!");
        return true;
    }
}
