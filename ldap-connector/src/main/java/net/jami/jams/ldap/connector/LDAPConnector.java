package net.jami.jams.ldap.connector;

import com.jsoniter.JsonIterator;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.authentication.AuthenticationSource;
import net.jami.jams.common.authentication.AuthenticationSourceInfo;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.authentication.ldap.LDAPSettings;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.common.objects.user.UserProfile;
import net.jami.jams.common.serialization.JsoniterRegistry;
import net.jami.jams.ldap.connector.service.AuthenticationService;
import net.jami.jams.ldap.connector.service.UserProfileService;
import org.ldaptive.BindConnectionInitializer;
import org.ldaptive.ConnectionConfig;
import org.ldaptive.Credential;
import org.ldaptive.DefaultConnectionFactory;

@Slf4j
public class LDAPConnector implements AuthenticationSource {

    private final AuthenticationService authenticationService;
    private final UserProfileService userProfileService;
    public static LDAPSettings settings;

    public LDAPConnector(String strSettings) {
        JsoniterRegistry.initCodecs();
        LDAPConnector.settings = JsonIterator.deserialize(strSettings,LDAPSettings.class);
        BindConnectionInitializer bindConnectionInitializer = new BindConnectionInitializer();
        bindConnectionInitializer.setBindDn(settings.getUsername());
        bindConnectionInitializer.setBindCredential(new Credential(settings.getPassword()));
        ConnectionConfig connConfig = ConnectionConfig.builder()
                .url(settings.getHost())
                .useStartTLS(settings.getUseStartTLS())
                .connectionInitializers(bindConnectionInitializer)
                .build();
        authenticationService = new AuthenticationService(new DefaultConnectionFactory(connConfig));
        userProfileService = new UserProfileService(new DefaultConnectionFactory(connConfig));
        log.info("Started LDAP Connector!");
    }

    @Override
    public boolean createUser(User user) {
        return false;
    }

    @Override
    public UserProfile[] getUserProfile(String queryString, String field) {
        return userProfileService.getUserProfile(queryString,field);
    }

    @Override
    public boolean authenticate(String username, String password) {
        return authenticationService.authenticateUser(username,password);
    }

    @Override
    public AuthenticationSourceInfo getInfo() {
        return new AuthenticationSourceInfo(settings.getRealm(), AuthenticationSourceType.LDAP);
    }

    @Override
    public boolean test() {
        return (getUserProfile("*","LOGON_NAME").length != 0);
    }


    @Override
    public boolean updatePassword(User user, String password) {
        return false;
    }
}
