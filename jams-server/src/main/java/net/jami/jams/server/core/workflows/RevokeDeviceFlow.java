package net.jami.jams.server.core.workflows;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.devices.Device;
import net.jami.jams.common.objects.requests.DeviceRevocationRequest;
import net.jami.jams.common.objects.requests.RevocationRequest;
import net.jami.jams.common.objects.requests.RevocationType;
import net.jami.jams.common.objects.responses.DeviceRevocationResponse;

import java.math.BigInteger;

import static net.jami.jams.server.Server.*;
import static net.jami.jams.server.Server.certificateAuthority;

@Slf4j
public class RevokeDeviceFlow {

    public static DeviceRevocationResponse revokeDevice(String username, RevocationRequest request){
        DeviceRevocationResponse response = new DeviceRevocationResponse();
        try {
            StatementList statementList = new StatementList();
            StatementElement st1 = new StatementElement("owner","=",username,"AND");
            StatementElement st2 = new StatementElement("deviceId","=",request.getIdentifier().toString(),"");
            statementList.addStatement(st1);
            statementList.addStatement(st2);
            Device device = dataStore.getDeviceDao().getObjects(statementList).get(0);
            if (device == null) {
                log.error("Could not find device!");
                return null;
            }
            certificateAuthority.revokeCertificate(request);
            long statTime = System.currentTimeMillis();
            while(certificateAuthority.getLatestCRL().get()
                    .getRevokedCertificate(device.getCertificate().getSerialNumber()) == null){
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
