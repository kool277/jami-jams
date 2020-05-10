package net.jami.jams.cryptoengine.workers.csr.builders;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.objects.devices.Device;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.cryptoengine.CryptoEngine;
import net.jami.jams.cryptoengine.workers.csr.utils.CertificateSigner;
import net.jami.jams.cryptoengine.workers.csr.utils.ExtensionLibrary;
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
                    new Date(System.currentTimeMillis() + CryptoEngine.deviceLifetime),
                    device.getCertificationRequest().getSubject(),
                    device.getCertificationRequest().getSubjectPublicKeyInfo()
            );
            device.setCertificate(CertificateSigner.signCertificate(user.getPrivateKey(),builder, ExtensionLibrary.deviceExtensions));
            return device;
        }
        catch (Exception e){
            log.error("Could not generate a user certificate: " + e.toString());
            return null;
        }
    }


}
