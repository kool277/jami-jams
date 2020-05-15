package net.jami.jams.common.authmodule;

import net.jami.jams.common.authentication.AuthenticationSource;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.jami.NameServer;
import net.jami.jams.common.objects.user.User;

import java.security.cert.X509Certificate;
import java.security.interfaces.RSAPublicKey;
import java.util.concurrent.ConcurrentHashMap;

public interface AuthenticationModule {

    void attachAuthSource(AuthenticationSourceType type, String settings);
    AuthTokenResponse authenticateUser(String username, String password);
    AuthTokenResponse authenticateUser(X509Certificate[] certificates);
    ConcurrentHashMap<AuthModuleKey, AuthenticationSource> getAuthSources();
    boolean testModuleConfiguration(AuthenticationSourceType type, String configuration);
    boolean createUser(AuthenticationSourceType type, String realm, NameServer nameServer, User user);
    RSAPublicKey getAuthModulePubKey();
}
