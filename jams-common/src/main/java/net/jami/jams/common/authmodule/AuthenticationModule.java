package net.jami.jams.common.authmodule;

import net.jami.jams.common.authentication.AuthenticationSource;
import net.jami.jams.common.authentication.AuthenticationSourceType;

import java.security.cert.X509Certificate;
import java.util.HashMap;

public interface AuthenticationModule {

    void attachAuthSource(AuthenticationSourceType type, String settings);
    AuthenticationResult authenticateUser(String username, String password);
    AuthenticationResult authenticateUser(X509Certificate[] certificates);
    String validateAndGetUsername(String token);
    HashMap<AuthModuleKey, AuthenticationSource> getAuthSources();
}
