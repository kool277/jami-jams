package net.jami.jams.cryptoengine.workers.csr.utils;

import net.jami.jams.cryptoengine.CryptoEngine;
import org.bouncycastle.asn1.x509.*;

public class ExtensionLibrary {

    public static CertificateExtendedData caExtensions = new CertificateExtendedData();
    public static CertificateExtendedData userExtensions = new CertificateExtendedData();
    public static CertificateExtendedData ocspExtensions = new CertificateExtendedData();
    public static CertificateExtendedData deviceExtensions = new CertificateExtendedData();

    private static final int SCHEMA = GeneralName.uniformResourceIdentifier;

    static {
        //Pre-Define the CRL Distribution Point
        DistributionPoint[] distPoints = new DistributionPoint[1];
        distPoints[0] = new DistributionPoint(new DistributionPointName(
                new GeneralNames(new GeneralName(SCHEMA, CryptoEngine.serverDomain + "/api/auth/crl")))
                , null, null
        );

        //Pre-Define the AIA Point
        AccessDescription accessDescription = new AccessDescription(
                AccessDescription.id_ad_ocsp,
                new GeneralName(SCHEMA,CryptoEngine.serverDomain + "/api/auth/ocsp")
        );

        //CA Extensions.
        caExtensions.getExtensions().add(new Object[]{Extension.basicConstraints, true, new BasicConstraints(10)});
        caExtensions.getExtensions().add(new Object[]{Extension.keyUsage, false, new KeyUsage(KeyUsage.cRLSign | KeyUsage.keyCertSign)});

        //OCSP Extensions.
        ocspExtensions.getExtensions().add(new Object[]{Extension.basicConstraints, true, new BasicConstraints(false)});
        ocspExtensions.getExtensions().add(new Object[]{Extension.extendedKeyUsage, false, new ExtendedKeyUsage(KeyPurposeId.id_kp_OCSPSigning)});
        ocspExtensions.getExtensions().add(new Object[]{Extension.keyUsage, false, new KeyUsage(KeyUsage.nonRepudiation | KeyUsage.digitalSignature | KeyUsage.keyEncipherment)});

        //User extensions (the user is a sub-CA)
        userExtensions.getExtensions().add(new Object[]{Extension.basicConstraints, true, new BasicConstraints(10)});
        userExtensions.getExtensions().add(new Object[]{Extension.keyUsage, false, new KeyUsage(KeyUsage.cRLSign | KeyUsage.keyCertSign)});
        userExtensions.getExtensions().add(new Object[]{Extension.cRLDistributionPoints, false, new CRLDistPoint(distPoints)});
        userExtensions.getExtensions().add(new Object[]{Extension.authorityInfoAccess, false, new AuthorityInformationAccess(accessDescription)});

        //Device extensions
        deviceExtensions.getExtensions().add(new Object[]{Extension.basicConstraints, true, new BasicConstraints(false)});
        deviceExtensions.getExtensions().add(new Object[]{Extension.keyUsage, false, new KeyUsage(KeyUsage.digitalSignature | KeyUsage.dataEncipherment | KeyUsage.keyAgreement | KeyUsage.nonRepudiation)});
        deviceExtensions.getExtensions().add(new Object[]{Extension.cRLDistributionPoints, false, new CRLDistPoint(distPoints)});
        deviceExtensions.getExtensions().add(new Object[]{Extension.authorityInfoAccess, false, new AuthorityInformationAccess(accessDescription)});
    }


}
