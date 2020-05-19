package net.jami.jams.authmodule;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.jami.NameRegistrationRequest;
import net.jami.jams.common.jami.NameServer;
import net.jami.jams.common.objects.roots.X509Fields;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.dht.DeviceReceiptGenerator;
import net.jami.jams.dht.ETHAddressGenerator;

import static net.jami.jams.authmodule.UserAuthenticationModule.certificateAuthority;
import static net.jami.jams.authmodule.UserAuthenticationModule.datastore;

@Slf4j
public class RegisterUserFlow {

    //Get the CA, sign, return the Jami ID.
    public static boolean createUser(User user, NameServer nameServer){
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
        //Didn't exactly plan on this happening here, but this is the only place we actually need it.
        //Given an interface of NameServer, we need to enroll the user or decline the enrollement before
        //storing him
        NameRegistrationRequest nameRegistrationRequest = new NameRegistrationRequest();
        nameRegistrationRequest.setOwner(ethKeyPair[0]);
        nameRegistrationRequest.setAddr(user.getJamiId());
        if(nameServer != null && nameServer.registerName(user.getUsername(), nameRegistrationRequest ) != 200){
           return false;
        }
        datastore.getUserDao().storeObject(user);
        log.info("Created the user " + user.getUsername() + " because he did not exist before!");
        return true;
    }
}
