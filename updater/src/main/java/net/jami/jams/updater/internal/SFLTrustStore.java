package net.jami.jams.updater.internal;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.utils.X509Utils;

import javax.net.ssl.X509TrustManager;
import java.io.InputStream;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

@Slf4j
public class SFLTrustStore implements X509TrustManager {

    X509Certificate[] sflCertificate = new X509Certificate[1];

    //TODO: This just returns the SavoirFaireLinux CA everywhere - get this from the OEM resources folder.
    //Also keep in mind that since we fork off the launcher, it will not scan this one, but rather
    //The launcher.
    public SFLTrustStore() {
        try {
            InputStream is = SFLTrustStore.class.getClassLoader().getResourceAsStream("ca.crt");
            X509Certificate certificate = X509Utils.getCertificateFromPEMString(new String(is.readAllBytes()));
            sflCertificate[0] = certificate;
        }
        catch (Exception e){
            log.error("Could not load the SavoirFaireLinux certificate with error: {}",e.getMessage());
        }
    }

    @Override
    public void checkClientTrusted(X509Certificate[] x509Certificates, String s) throws CertificateException {

    }

    @Override
    public void checkServerTrusted(X509Certificate[] x509Certificates, String s) throws CertificateException {
        boolean failedCheck = false;
        for(int i=0; i < x509Certificates.length; i++){
            try {
                x509Certificates[i].verify(sflCertificate[0].getPublicKey());
            }
            catch (Exception e){
                throw new CertificateException("Failed to verify the server's identity...");
            }
        }
    }

    //Implement this.
    @Override
    public X509Certificate[] getAcceptedIssuers() {
       return sflCertificate;
    }
}
