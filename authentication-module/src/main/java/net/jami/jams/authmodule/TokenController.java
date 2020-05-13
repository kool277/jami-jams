package net.jami.jams.authmodule;

import com.nimbusds.jose.JOSEObjectType;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import net.jami.jams.common.authmodule.AuthTokenResponse;
import net.jami.jams.common.objects.user.User;

import java.security.PrivateKey;
import java.util.Date;
import java.util.UUID;

public class TokenController{

    private static PrivateKey signingKey;

    public TokenController(PrivateKey signingKey) {
        TokenController.signingKey = signingKey;
    }

    public AuthTokenResponse getToken(User user) {
        AuthTokenResponse authTokenResponse = new AuthTokenResponse();
        JWSHeader jwsHeader = new JWSHeader.Builder(JWSAlgorithm.RS256).type(JOSEObjectType.JWT).build();
        JWTClaimsSet jwtClaims = new JWTClaimsSet.Builder()
                .issuer("JAMS")
                .subject(user.getUsername())
                .audience("JAMS")
                .claim("scope",user.getAccessLevel())
                .expirationTime(new Date(System.currentTimeMillis() + 30*60*1000))
                .notBeforeTime(new Date(System.currentTimeMillis()))
                .issueTime(new Date(System.currentTimeMillis()))
                .jwtID(UUID.randomUUID().toString())
                .build();
        SignedJWT signedJWT = new SignedJWT(jwsHeader, jwtClaims);
        try {
            signedJWT.sign(new RSASSASigner(signingKey));
            authTokenResponse.setAccess_token(signedJWT.serialize());
            authTokenResponse.setExpires_in(30*60*1000L);
            authTokenResponse.setScope(user.getAccessLevel());
            authTokenResponse.setToken_type("Bearer");
            return authTokenResponse;
        }
        catch (Exception e){
            return null;
        }
    }





}
