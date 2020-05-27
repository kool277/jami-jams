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
package net.jami.jams.server.core.workflows;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.authmodule.AuthModuleKey;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.devices.Device;
import net.jami.jams.common.objects.requests.DeviceRegistrationRequest;
import net.jami.jams.common.objects.responses.DeviceRegistrationResponse;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.common.objects.user.UserProfile;
import net.jami.jams.dht.DeviceReceiptGenerator;

import java.security.cert.X509Certificate;

import static net.jami.jams.server.Server.certificateAuthority;
import static net.jami.jams.server.Server.dataStore;
import static net.jami.jams.server.Server.nameServer;
import static net.jami.jams.server.Server.userAuthenticationModule;

@Slf4j
public class RegisterDeviceFlow {

    public static DeviceRegistrationResponse registerDevice(String username, DeviceRegistrationRequest registrationRequest){
        try {
            StatementList statementList = new StatementList();
            statementList.addStatement(new StatementElement("username", "=", username, ""));
            User user = dataStore.getUserDao().getObjects(statementList).get(0);
            if (user == null) {
                log.error("Tried to enroll a device, but could not find a user, this is impossible!");
            }
            Device device = new Device();
            device.setCertificationRequest(registrationRequest.getCsr());
            device.setOwner(username);
            device.setDisplayName(registrationRequest.getDeviceName());
            device = certificateAuthority.getSignedCertificate(user, device);
            if(device == null){
                log.error("Could not succesfully create a device certificate!");
                return null;
            }
            dataStore.getDeviceDao().storeObject(device);
            //Now we build this response out.
            DeviceRegistrationResponse response = new DeviceRegistrationResponse();
            //We need to set the device receipt....
            String[] devReceipt = DeviceReceiptGenerator.generateReceipt(user.getPrivateKey(), user.getCertificate().getPublicKey(),
                    device.getCertificate().getPublicKey(), user.getEthAddress());
            response.setDeviceReceipt(devReceipt[0]);
            response.setReceiptSignature(devReceipt[1]);
            response.setDisplayName(device.getDisplayName());
            //We need to set
            response.setNameServer(nameServer.getURI());
            UserProfile userProfile = userAuthenticationModule.getAuthSources()
                    .get(new AuthModuleKey(user.getRealm(),user.getUserType()))
                    .getUserProfile(username,"LOGON_NAME")[0];

            if(userProfile.getProfilePicture() != null) response.setUserPhoto(userProfile.getProfilePicture());
            //Finally we set the certificate chain.
            response.setCertificateChain(new X509Certificate[]{certificateAuthority.getCA(),user.getCertificate(),device.getCertificate()});
            return response;
        }
        catch (Exception e){
            log.error("An exception has occurred while trying to enroll a device with error {}",e.getMessage());
            return null;
        }
    }
}
