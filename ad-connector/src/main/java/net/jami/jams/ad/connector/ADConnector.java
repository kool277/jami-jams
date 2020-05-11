package net.jami.jams.ad.connector;

import com.imperva.ddc.core.query.Endpoint;
import com.jsoniter.JsonIterator;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.ad.connector.service.AuthenticationService;
import net.jami.jams.ad.connector.service.UserProfileService;
import net.jami.jams.common.authentication.AuthenticationSource;
import net.jami.jams.common.authentication.AuthenticationSourceInfo;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.authentication.activedirectory.ActiveDirectorySettings;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.common.objects.user.UserProfile;
import net.jami.jams.common.serialization.JsoniterRegistry;

import java.util.concurrent.ConcurrentLinkedQueue;

@Slf4j
public class ADConnector implements AuthenticationSource {

    private static final ConcurrentLinkedQueue<Endpoint> endpoints = new ConcurrentLinkedQueue<>();
    public static ActiveDirectorySettings settings;
    private final AuthenticationService authenticationService = new AuthenticationService();
    private final UserProfileService userProfileService = new UserProfileService();

    public ADConnector(String settings) {
        JsoniterRegistry.initCodecs();
        ADConnector.settings = JsonIterator.deserialize(settings,ActiveDirectorySettings.class);
        for(int i=0; i<10;i++){
            Endpoint endpoint = new Endpoint();
            endpoint.setSecuredConnection(ADConnector.settings.getSsl());
            endpoint.setPort(ADConnector.settings.getPort());
            endpoint.setHost(ADConnector.settings.getHost());
            endpoints.add(endpoint);
        }
        log.info("Started Active Directory Connector!");
    }

    public static Endpoint getConnection(){
        Endpoint endpoint = null;
        while(endpoint == null){
            endpoint = endpoints.poll();
        }
        endpoint.setUserAccountName(settings.getUsername()); //* You can use the user's Distinguished Name as well
        endpoint.setPassword(settings.getPassword());
        return endpoint;
    }

    public static Endpoint getConnection(String username, String password){
        Endpoint endpoint = null;
        while(endpoint == null){
            endpoint = endpoints.poll();
        }
        endpoint.setUserAccountName(ADConnector.settings.getRealm() + "\\" + username); //* You can use the user's Distinguished Name as well
        endpoint.setPassword(password);
        return endpoint;
    }

    public static void returnConnection(Endpoint connection){
        endpoints.add(connection);
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
        try {
            return authenticationService.authenticateUser(username, password);
        }
        catch (Exception e){
            return false;
        }
    }

    @Override
    public AuthenticationSourceInfo getInfo() {
        return new AuthenticationSourceInfo(settings.getRealm(), AuthenticationSourceType.AD);
    }

    @Override
    public boolean testConfiguration(String configuration) {
        return false;
    }

    @Override
    public boolean updatePassword(User user, String password) {
        return false;
    }


}
