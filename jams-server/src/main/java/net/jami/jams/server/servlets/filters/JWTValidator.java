package net.jami.jams.server.servlets.filters;

import com.nimbusds.jwt.SignedJWT;
import net.jami.jams.common.objects.user.AccessLevel;

import java.util.Date;

public class JWTValidator {

    public static boolean verifyLevel(SignedJWT signedJWT, AccessLevel TARGET_LEVEL){
        try {
            return AccessLevel.valueOf(signedJWT.getJWTClaimsSet().getClaim("scope").toString()).equals(TARGET_LEVEL);
        }
        catch (Exception e){
            return false;
        }
    }

    public static boolean verifyValidity(SignedJWT signedJWT){
        try {
            return signedJWT.getJWTClaimsSet().getExpirationTime().compareTo(new Date()) > 0;
        }
        catch (Exception e){
            return false;
        }
    }
}
