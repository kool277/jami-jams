package net.jami.jams.updater;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.utils.X509Utils;
import org.apache.http.ssl.SSLContexts;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;


@Slf4j
public class UpdateDownloader {

    private SSLSocketFactory sslSocketFactory;
    private SSLContext sslContext;
    private static final String KEYSTORE_TYPE = "JKS";
    private KeyStore trustStore;

    public UpdateDownloader() {
        try {
            InputStream is = UpdateCheckTask.class.getClassLoader().getResourceAsStream("oem/ca.crt");
            X509Certificate certificate = X509Utils.getCertificateFromPEMString(new String(is.readAllBytes()));
            trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
            trustStore.load(null, null);
            trustStore.setCertificateEntry("ca", certificate);
        }
        catch (Exception e){
            log.info("Could not load SFL's CA - this should not happen! detailed error: {}",e.getMessage());
        }
    }

    //TODO: Download the files and dump them into a tmp folder.
    public boolean downloadFiles(){
        try {
            //We can perpetually reload this,it doesn't really harm anything.
            //Build the SSL context here, (this is fairly simple)
            KeyStore ks = KeyStore.getInstance(KEYSTORE_TYPE);
            ks.load(null);
            ks.setKeyEntry("licenses", JAMSUpdater.privateKey,"".toCharArray(),new Certificate[]{JAMSUpdater.certificate});
            sslContext = SSLContexts.custom().loadKeyMaterial(ks, "".toCharArray()).loadTrustMaterial(trustStore, null).build();
            //Try to download the files and store the to /tmp

            //Check file checksums and trigger the update cycle itself - but this is already done in the outer function.
            return true;
        }
        catch (Exception e){
            log.error("Could not check for updates with error: {}",e.getMessage());
            return false;
        }
    }


}
