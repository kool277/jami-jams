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

import com.jsoniter.JsonIterator;
import lombok.extern.slf4j.Slf4j;

import net.jami.jams.authmodule.UserAuthenticationModule;
import net.jami.jams.common.authmodule.AuthModuleKey;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.devices.Device;
import net.jami.jams.common.objects.requests.DeviceRegistrationRequest;
import net.jami.jams.common.objects.responses.DeviceRegistrationResponse;
import net.jami.jams.common.objects.roots.X509Fields;
import net.jami.jams.common.objects.user.*;
import net.jami.jams.dht.DeviceReceiptGenerator;
import net.jami.jams.common.objects.user.Group;
import net.jami.jams.dht.ETHAddressGenerator;


import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static net.jami.jams.authmodule.UserAuthenticationModule.datastore;
import static net.jami.jams.server.Server.certificateAuthority;
import static net.jami.jams.server.Server.dataStore;
import static net.jami.jams.server.Server.nameServer;
import static net.jami.jams.server.Server.userAuthenticationModule;

@Slf4j
public class RegisterDeviceFlow {

    public static DeviceRegistrationResponse registerDevice(String username,
            DeviceRegistrationRequest registrationRequest) {
        try {
            StatementList statementList = new StatementList();
            statementList.addStatement(new StatementElement("username", "=", username, ""));
            User user = dataStore.getUserDao().getObjects(statementList).get(0);
            UserProfile userProfile = userAuthenticationModule.getAuthSources()
                    .get(new AuthModuleKey(user.getRealm(), user.getUserType()))
                    .searchUserProfiles(username, "LOGON_NAME", Optional.empty()).get(0);

            if (user == null) {
                log.error("Tried to enroll a device, but could not find a user, this is impossible!");
            }

            // Renew user certificate if expired with same private key
            if(!user.getCertificate().getNotAfter().after(new Date())) {
                user = UserAuthenticationModule.certificateAuthority.getRefreshedCertificate(user);
                datastore.updateUserCertificate(user);
            }

            Device device = new Device();
            device.setCertificationRequest(registrationRequest.getCsr());
            device.setOwner(username);
            device.setDisplayName(registrationRequest.getDeviceName());
            device = certificateAuthority.getSignedCertificate(user, device);
            if (device == null) {
                log.error("Could not succesfully create a device certificate!");
                return null;
            }
            dataStore.getDeviceDao().storeObject(device);

            Group group = new Group();

            statementList = new StatementList();
            statementList.addStatement(new StatementElement("username", "=", username, ""));
            if (dataStore.getUserGroupMappingsDao().getObjects(statementList) != null && !dataStore.getUserGroupMappingsDao().getObjects(statementList).isEmpty()) {
                UserGroupMapping mapping = dataStore.getUserGroupMappingsDao().getObjects(statementList).get(0);
                statementList = new StatementList();
                statementList.addStatement(new StatementElement("id", "=", mapping.getGroupId(), ""));
                group =  dataStore.getGroupDao().getObjects(statementList).get(0);
            }

            DeviceRegistrationResponse response = new DeviceRegistrationResponse();
            if (!group.isEmpty() && group.hasBlueprint()) {
                StatementElement st2 = new StatementElement("name", "=", group.getBlueprint(), "");
                StatementList statementList2 = new StatementList();
                statementList2.addStatement((st2));
                try {
                    Policy policy = dataStore.getPolicyDao().getObjects(statementList2).get(0);
                    response.setPolicyData(policy.getPolicyData());
                } catch (Exception e1) {
                    log.warn("No policy available for user - not adding a policy component to response");
                }
            }
            // Device receipt
            String[] devReceipt = DeviceReceiptGenerator.generateReceipt(user.getPrivateKey(),
                    user.getCertificate().getPublicKey(), device.getCertificate().getPublicKey(), user.getEthAddress());
            response.setDeviceReceipt(devReceipt[0]);
            response.setReceiptSignature(devReceipt[1]);
            response.setDisplayName(userProfile.getFirstName() + " " + userProfile.getLastName());

            response.setNameServer(nameServer.getURI());
            if (userProfile.getProfilePicture() != null)
                response.setUserPhoto(userProfile.getProfilePicture());
            // Chain certificate
            response.setCertificateChain(new X509Certificate[] { certificateAuthority.getCA(), user.getCertificate(),
                    device.getCertificate() });
            return response;
        } catch (Exception e) {
            log.error("An exception has occurred while trying to enroll a device with error {}", e.getMessage());
            return null;
        }
    }
}
