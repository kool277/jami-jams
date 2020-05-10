package net.jami.jams.server.core.workflows;

import net.jami.jams.common.objects.user.User;
import net.jami.jams.dht.DeviceReceiptGenerator;
import net.jami.jams.dht.ETHAddressGenerator;

import static net.jami.jams.server.Server.certificateAuthority;

public class RegisterUserFlow {

    //Get the CA, sign, return the Jami ID.
    public static User createUser(User user){
        //This generates the X509 Fields we need.
        user = certificateAuthority.getSignedCertificate(user);
        String[] ethKeyPair = null;
        while(ethKeyPair == null){
            ethKeyPair = ETHAddressGenerator.generateAddress();
        }
        user.setEthAddress(ethKeyPair[0]);
        user.setEthKey(ethKeyPair[1]);
        user.setJamiId(DeviceReceiptGenerator.generateJamiId(user));
        return user;
    }
}
