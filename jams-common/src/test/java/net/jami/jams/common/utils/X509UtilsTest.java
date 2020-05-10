package net.jami.jams.common.utils;

import org.bouncycastle.pkcs.PKCS10CertificationRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;

import static org.junit.jupiter.api.Assertions.fail;

class X509UtilsTest {

    static String strPrivateKey;
    static String strCertificate;
    static String strPkcs10Request;

    @BeforeAll
    public static void loadProps(){
        try {
            InputStream path;
            ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
            path = classLoader.getResourceAsStream("cakey.txt");
            strPrivateKey = new String(path.readAllBytes());
            path = classLoader.getResourceAsStream("cacert.txt");
            strCertificate = new String(path.readAllBytes());
            path = classLoader.getResourceAsStream("pkcs10request.txt");
            strPkcs10Request = new String(path.readAllBytes());
        }
        catch (Exception e){
            fail("Could not set-up resources for test!");
        }
    }

    @Test
    void getKeyFromPEMString() {
        PrivateKey privateKey;
        privateKey = X509Utils.getKeyFromPEMString(strPrivateKey);
        Assertions.assertNotNull(privateKey,"Could not decode a correctly formatted private key!");
        privateKey = X509Utils.getKeyFromPEMString(strPrivateKey.substring(10));
        Assertions.assertNull(privateKey,"Decoded a private key from an incorrect string!");
    }

    @Test
    void getCertificateFromPEMString() {
        X509Certificate x509Certificate;
        x509Certificate = X509Utils.getCertificateFromPEMString(strCertificate);
        Assertions.assertNotNull(x509Certificate,"Could not decoded a correctly formatted certificate!");
        x509Certificate = X509Utils.getCertificateFromPEMString(strCertificate.substring(25));
        Assertions.assertNull(x509Certificate,"Decoded certificate from an incorrect string!");
    }

    @Test
    void getPEMStringFromPrivateKey() {
        PrivateKey privateKey;
        privateKey = X509Utils.getKeyFromPEMString(strPrivateKey);
        Assertions.assertNotNull(privateKey,"Could not decode a correctly formatted private key!");
        String str = X509Utils.getPEMStringFromPrivateKey(privateKey);
        PrivateKey privateKey1 = X509Utils.getKeyFromPEMString(str);
        Assertions.assertEquals(privateKey,privateKey1,"Keys do not match - although they should!");
    }

    @Test
    void getPEMStringFromCertificate() {
        X509Certificate x509Certificate;
        x509Certificate = X509Utils.getCertificateFromPEMString(strCertificate);
        Assertions.assertNotNull(x509Certificate,"Could not decoded a correctly formatted certificate!");
        String str = X509Utils.getPEMStringFromCertificate(x509Certificate);
        X509Certificate x509Certificate1 = X509Utils.getCertificateFromPEMString(str);
        Assertions.assertEquals(x509Certificate,x509Certificate1,"Certificates do not match - although they should!");
    }

    @Test
    void getCSRFromString() {
        PKCS10CertificationRequest certificationRequest;
        certificationRequest = X509Utils.getCSRFromString(strPkcs10Request);
        Assertions.assertNotNull(certificationRequest,"Certification request should have been parsed correctly!");
        certificationRequest = X509Utils.getCSRFromString(strPkcs10Request.substring(23));
        Assertions.assertNull(certificationRequest,"Certification request should not have been parsed!");
    }
}