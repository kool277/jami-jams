package net.jami.jams.ca.workers.csr;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.ca.workers.csr.builders.DeviceBuilder;
import net.jami.jams.ca.workers.csr.builders.SystemAccountBuilder;
import net.jami.jams.ca.workers.csr.builders.UserBuilder;
import net.jami.jams.common.objects.devices.Device;
import net.jami.jams.common.objects.system.SystemAccount;
import net.jami.jams.common.objects.user.User;

@Slf4j
public class CertificateWorker {

    //The CSR here is null because we generate a certificate and keypair.
    public static SystemAccount getSignedCertificate(SystemAccount systemAccount) {
        switch (systemAccount.getSystemAccountType()){
            case CA: return SystemAccountBuilder.generateCA(systemAccount);
            case OCSP: return SystemAccountBuilder.generateOCSP(systemAccount);
            default: return null;
        }
    }

    public static User getSignedCertificate(User user){
        return UserBuilder.generateUser(user);
    }

    public static Device getSignedCertificate(User user, Device device){
        return DeviceBuilder.generateDevice(user,device);
    }
}
