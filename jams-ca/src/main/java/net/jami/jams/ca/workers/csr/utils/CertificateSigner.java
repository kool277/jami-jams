package net.jami.jams.ca.workers.csr.utils;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.ca.JamsCA;
import org.bouncycastle.asn1.ASN1Encodable;
import org.bouncycastle.asn1.ASN1ObjectIdentifier;
import org.bouncycastle.asn1.x509.AlgorithmIdentifier;
import org.bouncycastle.asn1.x509.Certificate;
import org.bouncycastle.cert.X509v3CertificateBuilder;
import org.bouncycastle.crypto.params.AsymmetricKeyParameter;
import org.bouncycastle.crypto.util.PrivateKeyFactory;
import org.bouncycastle.jcajce.provider.asymmetric.x509.CertificateFactory;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.DefaultDigestAlgorithmIdentifierFinder;
import org.bouncycastle.operator.DefaultSignatureAlgorithmIdentifierFinder;
import org.bouncycastle.operator.bc.BcRSAContentSignerBuilder;

import java.io.ByteArrayInputStream;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;

@Slf4j
public class CertificateSigner {

    public static X509Certificate signCertificate(PrivateKey privateKey, X509v3CertificateBuilder certificateBuilder,
                                                  CertificateExtendedData certificateExtendedData){
        try {
            //Appose the extended data from the template.
            for(Object[] extensions : certificateExtendedData.getExtensions()){
                certificateBuilder.addExtension((ASN1ObjectIdentifier) extensions[0],(boolean) extensions[1],(ASN1Encodable) extensions[2]);
            }
            //Initialize the signing.
            AlgorithmIdentifier sigAlgId = new DefaultSignatureAlgorithmIdentifierFinder().find(JamsCA.signingAlgorithm);
            AlgorithmIdentifier digAlgId = new DefaultDigestAlgorithmIdentifierFinder().find(sigAlgId);
            AsymmetricKeyParameter asymmetricKeyParameter = PrivateKeyFactory.createKey(privateKey.getEncoded());
            //Sign the certificate.
            ContentSigner sigGen = new BcRSAContentSignerBuilder(sigAlgId, digAlgId).build(asymmetricKeyParameter);
            Certificate eeX509CertificateStructure = certificateBuilder.build(sigGen).toASN1Structure();
            return (X509Certificate) new CertificateFactory().engineGenerateCertificate(new ByteArrayInputStream(eeX509CertificateStructure.getEncoded()));
        }
        catch (Exception e){
            log.error("Could not sign a certificate with error: " + e.toString());
            return null;
        }
    }


}
