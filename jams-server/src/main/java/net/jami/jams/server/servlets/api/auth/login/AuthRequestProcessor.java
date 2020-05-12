package net.jami.jams.server.servlets.api.auth.login;

import net.jami.jams.common.authmodule.AuthenticationResult;

import java.security.cert.X509Certificate;

import static net.jami.jams.server.Server.userAuthenticationModule;

public class AuthRequestProcessor {

    //This case does not talk to the authentication module, only to the ca
    public static AuthenticationResult processX509Auth(X509Certificate[] certificates){
        return userAuthenticationModule.authenticateUser(certificates);
    }

    public static AuthenticationResult processUsernamePasswordAuth(String username, String password){
        return userAuthenticationModule.authenticateUser(username,password);
    }

    public static AuthenticationResult processUsernamePasswordAuth(String authorization){
        String[] credentials = Decoders.decodeAuthHeader(authorization);
        if(credentials != null && credentials.length == 2) {
            return userAuthenticationModule.authenticateUser(credentials[0], credentials[1]);
        }
        return new AuthenticationResult(false,null);
    }
}
