package net.jami.jams.server.core.workflows;

import lombok.extern.slf4j.Slf4j;

import java.io.FileOutputStream;
import java.security.KeyStore;

@Slf4j
public class ActivateSubscriptionWorkflow {

    public static boolean activateSubscription(String data){
        try {
            //TODO: Decode the the data into a certificate and private key.

            //TODO: Verify that the certificate has really been signed by SavoirFaireLinux and is valid.

            //Build a keystore from the data.
            KeyStore ks = KeyStore.getInstance("JKS");
            char[] password = "changeit".toCharArray();
            ks.load(null, password);
            ks.setKeyEntry("license",null,null);
            FileOutputStream fos = new FileOutputStream("license.jks");
            ks.store(fos, password);
            fos.close();
            log.info("Succesfully activated your license!");
            return true;
        }
        catch (Exception e){
            log.error("The activation process failed with error: {}",e.getMessage());
            return false;
        }
    }


}
