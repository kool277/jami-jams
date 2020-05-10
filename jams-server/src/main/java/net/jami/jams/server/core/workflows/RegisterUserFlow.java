package net.jami.jams.server.core.workflows;

import net.jami.jams.common.objects.user.User;

import static net.jami.jams.server.Server.certificateAuthority;

public class RegisterUserFlow {

    //Get the CA, sign, return the Jami ID.
    public static User createUser(User user){
        user = certificateAuthority.getSignedCertificate(user);
        //while(ethKeyPair == null){
        //    ethKeyPair = ETHAddressGenerator.generateAddress();
        //}
        //user.setEthAddress(ethKeyPair[0]);
        //user.setEthKey(ethKeyPair[1]);
        //user.setJamiId(Hex.encodeHexString(MessageDigest.getInstance(MessageDigestAlgorithms.SHA_1).digest(userKeyPair.getPublic().getEncoded())));
        //user.setEthAddress();
        //user.setJamiId();
        return user;
    }


}
