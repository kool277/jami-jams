package net.jami.jams.ldap.connector.service;

import lombok.extern.slf4j.Slf4j;
import org.ldaptive.ConnectionFactory;
import org.ldaptive.Credential;
import org.ldaptive.auth.*;

import static net.jami.jams.ldap.connector.LDAPConnector.settings;

@Slf4j
public class AuthenticationService {

    private final ConnectionFactory connectionFactory;

    public AuthenticationService(ConnectionFactory connectionFactory) {
        this.connectionFactory = connectionFactory;
    }

    public boolean authenticateUser(String username, String password) {
        try {
            FormatDnResolver dnResolver = new FormatDnResolver();
            dnResolver.setFormat(settings.getUsernameField() + "=%s," + settings.getBaseDN());
            SimpleBindAuthenticationHandler bindAuthenticationHandler = new SimpleBindAuthenticationHandler(connectionFactory);
            Authenticator auth = new Authenticator();
            auth.setDnResolver(dnResolver);
            auth.setAuthenticationHandler(bindAuthenticationHandler);
            AuthenticationResponse resp = auth.authenticate(new AuthenticationRequest(username, new Credential(password)));
            log.info("User " + username + " has tried to authenticate with result: " + resp.getAuthenticationResultCode());
            return resp.isSuccess();
        }
        catch (Exception e){
            log.info("An exception has occured trying to process and authentication request: " + e.toString());
            return false;
        }
    }


}
