package net.jami.jams.ca.workers.csr.builders;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.objects.system.SystemAccount;
import net.jami.jams.ca.JamsCA;
import net.jami.jams.ca.workers.csr.utils.CertificateSigner;
import net.jami.jams.ca.workers.csr.utils.ExtensionLibrary;
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
public class SystemAccountBuilder {

    //Self-signed because it is a CA
    public static SystemAccount generateCA(SystemAccount systemAccount){
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(4096);
            KeyPair keyPair = keyPairGenerator.generateKeyPair();
            X509v3CertificateBuilder builder = new X509v3CertificateBuilder(
                    new X500Name("CN=" + systemAccount.getX509Fields().getDN()),
                    new BigInteger(256, new SecureRandom()),
                    new Date(System.currentTimeMillis()),
                    new Date(System.currentTimeMillis() + JamsCA.caLifetime),
                    new X500Name("CN="+ systemAccount.getX509Fields().getDN()),
                    SubjectPublicKeyInfo.getInstance(keyPair.getPublic().getEncoded())
            );
            systemAccount.setPrivateKey(keyPair.getPrivate());
            systemAccount.setCertificate(CertificateSigner.signCertificate(keyPair.getPrivate(),builder, ExtensionLibrary.caExtensions));
            return systemAccount;
        }
        catch (Exception e){
            log.error("Could not generate the system's CA: " + e.toString());
            return null;
        }
    }

    //This is signed by the CA, the OCSP certificate has the same lifetime as the CA by default.
    //someday this could change.
    public static SystemAccount generateOCSP(SystemAccount systemAccount){
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(4096);
            KeyPair keyPair = keyPairGenerator.generateKeyPair();
            X509v3CertificateBuilder builder = new X509v3CertificateBuilder(
                    new JcaX509CertificateHolder(JamsCA.CA.getCertificate()).getSubject(),
                    new BigInteger(256, new SecureRandom()),
                    new Date(System.currentTimeMillis()),
                    new Date(System.currentTimeMillis() + JamsCA.caLifetime),
                    new X500Name("CN=" + systemAccount.getX509Fields().getDN()),
                    SubjectPublicKeyInfo.getInstance(keyPair.getPublic().getEncoded())
            );
            systemAccount.setPrivateKey(keyPair.getPrivate());
            systemAccount.setCertificate(CertificateSigner.signCertificate(JamsCA.CA.getPrivateKey(), builder, ExtensionLibrary.caExtensions));
            return systemAccount;
        }
        catch (Exception e){
            log.error("Could not generate the system's OCSP: " + e.toString());
            return null;
        }
    }

}
