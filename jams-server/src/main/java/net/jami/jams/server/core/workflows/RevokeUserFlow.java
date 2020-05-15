package net.jami.jams.server.core.workflows;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.devices.Device;
import net.jami.jams.common.objects.requests.RevocationRequest;
import net.jami.jams.common.objects.responses.DeviceRevocationResponse;
import net.jami.jams.common.objects.user.User;

import static net.jami.jams.server.Server.certificateAuthority;
import static net.jami.jams.server.Server.dataStore;

@Slf4j
public class RevokeUserFlow {

    public static DeviceRevocationResponse revokeUser(String username, RevocationRequest request){
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
