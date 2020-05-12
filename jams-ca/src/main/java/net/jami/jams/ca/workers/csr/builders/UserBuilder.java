package net.jami.jams.ca.workers.csr.builders;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.ca.JamsCA;
import net.jami.jams.ca.workers.csr.utils.CertificateSigner;
import net.jami.jams.ca.workers.csr.utils.ExtensionLibrary;
import net.jami.jams.common.objects.user.User;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;
import org.bouncycastle.cert.X509v3CertificateBuilder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;

import java.math.BigInteger;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.SecureRandom;
import java.util.Date;

@Slf4j
public class UserBuilder {

    public static User generateUser(User user){
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(4096);
            KeyPair keyPair = keyPairGenerator.generateKeyPair();
            X509v3CertificateBuilder builder = new X509v3CertificateBuilder(
                    new JcaX509CertificateHolder(JamsCA.CA.getCertificate()).getSubject(),
                    new BigInteger(256, new SecureRandom()),
                    new Date(System.currentTimeMillis()),
                    new Date(System.currentTimeMillis() + JamsCA.userLifetime),
                    new X500Name(user.getX509Fields().getDN()),
                    SubjectPublicKeyInfo.getInstance(keyPair.getPublic().getEncoded())
            );
            user.setPrivateKey(keyPair.getPrivate());
            user.setCertificate(CertificateSigner.signCertificate(JamsCA.CA.getPrivateKey(),builder, ExtensionLibrary.userExtensions));
            return user;
        }
        catch (Exception e){
            log.error("Could not generate a user certificate: " + e.toString());
            return null;
        }
    }
}
