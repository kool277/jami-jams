package net.jami.jams.authmodule;

import net.jami.jams.common.objects.user.User;
import net.jami.jams.dht.DeviceReceiptGenerator;
import net.jami.jams.dht.ETHAddressGenerator;

import static net.jami.jams.authmodule.UserAuthenticationModule.certificateAuthority;
import static net.jami.jams.authmodule.UserAuthenticationModule.datastore;

public class RegisterUserFlow {

    //Get the CA, sign, return the Jami ID.
    public static void createUser(User user){
        //This generates the X509 Fields we need.
        user = certificateAuthority.getSignedCertificate(user);
        String[] ethKeyPair = null;
        while(ethKeyPair == null){
            ethKeyPair = ETHAddressGenerator.generateAddress();
        }
        user.setEthAddress(ethKeyPair[0]);
        user.setEthKey(ethKeyPair[1]);
        user.setJamiId(DeviceReceiptGenerator.generateJamiId(user));
        datastore.getUserDao().storeObject(user);
    }
}
