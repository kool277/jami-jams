package net.jami.jams.ca.workers.csr.builders;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.ca.JamsCA;
import net.jami.jams.ca.workers.csr.utils.CertificateSigner;
import net.jami.jams.ca.workers.csr.utils.ExtensionLibrary;
import net.jami.jams.common.objects.devices.Device;
import net.jami.jams.common.objects.user.User;
import org.bouncycastle.cert.X509v3CertificateBuilder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.Date;

@Slf4j
public class DeviceBuilder {

    public static Device generateDevice(User user, Device device){
        try {
            X509v3CertificateBuilder builder = new X509v3CertificateBuilder(
                    new JcaX509CertificateHolder(user.getCertificate()).getSubject(),
                    new BigInteger(256, new SecureRandom()),
                    new Date(System.currentTimeMillis()),
                    new Date(System.currentTimeMillis() + JamsCA.deviceLifetime),
                    device.getCertificationRequest().getSubject(),
                    device.getCertificationRequest().getSubjectPublicKeyInfo()
            );
            device.setCertificate(CertificateSigner.signCertificate(user.getPrivateKey(),builder, ExtensionLibrary.deviceExtensions));
            //kill off the certification request it's useless.
            device.setCertificationRequest(null);
            return device;
        }
        catch (Exception e){
            log.error("Could not generate a user certificate: " + e.toString());
            return null;
        }
    }


}
