package net.jami.jams.authmodule;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.objects.roots.X509Fields;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.dht.DeviceReceiptGenerator;
import net.jami.jams.dht.ETHAddressGenerator;

import static net.jami.jams.authmodule.UserAuthenticationModule.certificateAuthority;
import static net.jami.jams.authmodule.UserAuthenticationModule.datastore;

@Slf4j
public class RegisterUserFlow {

    //Get the CA, sign, return the Jami ID.
    public static void createUser(User user){
        //This generates the X509 Fields we need.
        user.setX509Fields(new X509Fields());
        user.getX509Fields().setCommonName(user.getUsername());
        user = certificateAuthority.getSignedCertificate(user);
        String[] ethKeyPair = null;
        while(ethKeyPair == null){
            ethKeyPair = ETHAddressGenerator.generateAddress();
        }
        user.setEthAddress(ethKeyPair[0]);
        user.setEthKey(ethKeyPair[1]);
        user.setJamiId(DeviceReceiptGenerator.generateJamiId(user));
        datastore.getUserDao().storeObject(user);
        log.info("Create the user " + user.getUsername() + " because he did not exist before!");
    }
}
