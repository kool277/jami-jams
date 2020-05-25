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
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.requests.RevocationRequest;
import net.jami.jams.common.objects.requests.RevocationType;
import net.jami.jams.common.objects.responses.DeviceRevocationResponse;
import net.jami.jams.common.objects.user.User;

import static net.jami.jams.server.Server.certificateAuthority;
import static net.jami.jams.server.Server.dataStore;

@Slf4j
public class RevokeUserFlow {

    public static DeviceRevocationResponse revokeUser(String username){
        DeviceRevocationResponse response = new DeviceRevocationResponse();
        try {
            StatementList statementList = new StatementList();
            StatementElement st1 = new StatementElement("username","=",username,"");
            statementList.addStatement(st1);
            User user = dataStore.getUserDao().getObjects(statementList).get(0);
            if (user == null) {
                log.error("Could not find user!");
                return null;
            }
            RevocationRequest request = new RevocationRequest();
            request.setRevocationType(RevocationType.USER);
            request.setIdentifier(user.getCertificate().getSerialNumber());
            certificateAuthority.revokeCertificate(request);
            long statTime = System.currentTimeMillis();
            while(certificateAuthority.getLatestCRL().get()
                    .getRevokedCertificate(user.getCertificate().getSerialNumber()) == null){
                log.warn("Certificate has not yet appeared in CRL!");
                if(System.currentTimeMillis() - statTime > 1000){
                    log.error("The certificate has not appeared within 1 second, we are considering the operation has failed");
                    response.setSuccess(false);
                    return response;
                }
            }
            //Finally we return the successful response
            response.setSuccess(true);
            return response;
        }
        catch (Exception e){
            log.error("An exception has occurred while trying to revoke a device with error {}", e.getMessage());
            response.setSuccess(false);
            response.setErrorDetails(e.getMessage());
            return response;
        }
    }
}
