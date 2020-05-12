package net.jami.jams.common.utils;

import net.jami.jams.common.objects.requests.CreateCARequest;

import java.math.BigInteger;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

public class Validator {

    public static boolean validateCARequests(CreateCARequest request){
        if(request.getCertificate() != null && request.getPrivateKey() != null){
            if(request.getCertificate().getBasicConstraints() != -1){
                RSAPublicKey rsaPublicKey = (RSAPublicKey) request.getCertificate().getPublicKey();
                RSAPrivateKey rsaPrivateKey = (RSAPrivateKey) request.getPrivateKey();
                return rsaPublicKey.getModulus().equals( rsaPrivateKey.getModulus() )
                        && BigInteger.valueOf( 2 ).modPow( rsaPublicKey.getPublicExponent()
                                .multiply( rsaPrivateKey.getPrivateExponent() ).subtract( BigInteger.ONE ),
                        rsaPublicKey.getModulus() ).equals( BigInteger.ONE );
            }
            return false;
        }
        return true;
    }

}
