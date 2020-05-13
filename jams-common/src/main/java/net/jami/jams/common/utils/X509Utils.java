package net.jami.jams.common.utils;

import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;
import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

@Slf4j
public class X509Utils {

    private static final String PVK_HEADER = "-----BEGIN PRIVATE KEY-----\n";
    private static final String PVK_TAIL = "\n-----END PRIVATE KEY-----";
    private static final String CERT_HEADER = "-----BEGIN CERTIFICATE-----\n";
    private static final String CERT_TAIL = "\n-----END CERTIFICATE-----";
    private static final String PPK_HEADER = "-----BEGIN PUBLIC KEY-----\n";
    private static final String PPK_TAIL = "\n-----END PUBLIC KEY-----";

    public static PrivateKey getKeyFromPEMString(String keyString) {
        try {
            PEMParser parser = new PEMParser(new StringReader(keyString));
            Object parsedObject = parser.readObject();
            if (parsedObject instanceof PEMKeyPair) {
                PEMKeyPair pk = (PEMKeyPair) parsedObject;
                PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(pk.getPrivateKeyInfo().getEncoded());
                return KeyFactory.getInstance("RSA").generatePrivate(keySpec);
            } else {
                JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
                return converter.getPrivateKey((PrivateKeyInfo) parsedObject);
            }
        } catch (Exception e) {
            log.error("An error has occured trying to convert the PEM to PrivateKey, stack trace: " + e.toString());
            return null;
        }
    }

    public static PublicKey getPubKeyFromPEMString(String keyString){
        try {
            PEMParser parser = new PEMParser(new StringReader(keyString));
            Object parsedObject = parser.readObject();
            if (parsedObject instanceof PEMKeyPair) {
                PEMKeyPair pk = (PEMKeyPair) parsedObject;
                PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(pk.getPublicKeyInfo().getEncoded());
                return KeyFactory.getInstance("RSA").generatePublic(keySpec);
            } else {
                JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
                return converter.getPublicKey((SubjectPublicKeyInfo) parsedObject);
            }
        }
        catch (Exception e){
            log.error("And error has occurred reading the public key from string!");
            return null;
        }
    }


    public static X509Certificate getCertificateFromPEMString(String certificateString) {
        try {
            CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
            InputStream inputStream = new ByteArrayInputStream(certificateString.getBytes());
            return (X509Certificate) certificateFactory.generateCertificate(inputStream);
        } catch (Exception e) {
            log.error("An error has occured trying to convert the PEM to X509, stack trace: " + e.toString());
            return null;
        }
    }

    public static String getPEMStringFromPrivateKey(PrivateKey privateKey) {
        StringBuilder stringBuilder = new StringBuilder();
        try {
            stringBuilder.append(PVK_HEADER);
            stringBuilder.append(Base64.getEncoder().encodeToString(privateKey.getEncoded()));
            stringBuilder.append(PVK_TAIL);
            return stringBuilder.toString();
        } catch (Exception e) {
            log.error("An error has occured trying to convert the Private Key to PEM, stack trace: " + e.toString());
            return null;
        }
    }

    public static String getPEMStringFromCertificate(X509Certificate certificate) {
        StringBuilder stringBuilder = new StringBuilder();
        try {
            stringBuilder.append(CERT_HEADER);
            stringBuilder.append(Base64.getEncoder().encodeToString(certificate.getEncoded()));
            stringBuilder.append(CERT_TAIL);
            return stringBuilder.toString();
        } catch (Exception e) {
            log.error("An error has occured trying to convert the Certificate Key to PEM, stack trace: " + e.toString());
            return null;
        }
    }

    public static String getPEMStringFromPubKey(PublicKey publicKey){
        StringBuilder stringBuilder = new StringBuilder();
        try {
            stringBuilder.append(PPK_HEADER);
            stringBuilder.append(Base64.getEncoder().encodeToString(publicKey.getEncoded()));
            stringBuilder.append(PPK_TAIL);
            return stringBuilder.toString();
        } catch (Exception e) {
            log.error("An error has occured trying to convert the Public Key to PEM, stack trace: " + e.toString());
            return null;
        }
    }

    public static PKCS10CertificationRequest getCSRFromString(String pkcs10StringRequest) {
        try {
            ByteArrayInputStream pemStream = new ByteArrayInputStream(pkcs10StringRequest.getBytes(StandardCharsets.UTF_8));
            PEMParser pemParser = new PEMParser(new BufferedReader(new InputStreamReader(pemStream)));
            Object parsedObj = pemParser.readObject();
            if (parsedObj instanceof PKCS10CertificationRequest) return (PKCS10CertificationRequest) parsedObj;
            log.error("The request does not seem to be a CSR request!");
            return null;
        } catch (Exception e) {
            log.error("An error has occured trying to convert a string to a PKCS10 Certification Request, stack trace: " + e.toString());
            return null;
        }
    }

}
