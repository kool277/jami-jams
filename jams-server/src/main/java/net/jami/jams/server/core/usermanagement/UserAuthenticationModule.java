package net.jami.jams.server.core.usermanagement;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.authentication.AuthenticationSource;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.server.core.workflows.RegisterUserFlow;
import net.jami.jams.server.startup.LibraryLoader;

import java.util.HashMap;

import static net.jami.jams.server.Server.dataStore;

@Slf4j
public class UserAuthenticationModule {
    //This contains the DOMAIN-SOURCE.
    //In general there is at most 2 here.
    private final HashMap<AuthModuleKey, AuthenticationSource> authenticationSources = new HashMap<>();

    //We should initialize the authentication sources here, based on configurations, by default,
    //we only attach the basic one.
    public UserAuthenticationModule() {
        authenticationSources.put(new AuthModuleKey("LOCAL", AuthenticationSourceType.LOCAL), dataStore);
    }

    public void attachAuthSource(String realm, AuthenticationSourceType type, AuthenticationSource source){
        authenticationSources.put(new AuthModuleKey(realm,type), source);
    }

    public void attachLDAPAuthSource(String settings){
        try {
            Class<?> cls = LibraryLoader.classLoader.loadClass("net.jami.jams.ldap.connector.LDAPConnector");
            AuthenticationSource source = (AuthenticationSource) cls.getConstructor(String.class).newInstance(settings);
            authenticationSources.put(new AuthModuleKey(source.getInfo().getRealm(),source.getInfo().getAuthenticationSourceType()), source);
        }
        catch (Exception e){
            log.error("Could not load an ldap directory connector with reason: " + e.toString());
        }
    }

    //Repeat the same technique for the LDAP connector.
    public void attachADAuthSource(String settings){
        try {
            Class<?> cls = LibraryLoader.classLoader.loadClass("net.jami.jams.ad.connector.ADConnector");
            AuthenticationSource source = (AuthenticationSource) cls.getConstructor(String.class).newInstance(settings);
            authenticationSources.put(new AuthModuleKey(source.getInfo().getRealm(),source.getInfo().getAuthenticationSourceType()), source);
        }
        catch (Exception e){
            log.error("Could not load an active directory connector with reason: " + e.toString());
        }
    }

    public boolean authenticateUser(String username, String password){
        //The user could already exist, so we pull him up.
        if(dataStore.userExists(username)){
            StatementList statementList = new StatementList();
            StatementElement statementElement = new StatementElement("username","=",username,"");
            statementList.addStatement(statementElement);
            User user = dataStore.getUserDao().getObjects(statementList).get(0);
            return authenticationSources.get(new AuthModuleKey(user.getRealm(),user.getUserType()))
                    .authenticate(username,password);
        }
        //The second case is much more violent, because we don't know in advance "where" this user comes
        //from, so we have to infer (this is only really true for "users", all others are usually pre-marked)
        //This is also the case when we store the user into the DAO - because he never existed before.
        for(AuthModuleKey key : authenticationSources.keySet()){
            if(authenticationSources.get(key).authenticate(username,password)){
                User user = new User();
                user.setUsername(username);
                user.setRealm(key.getRealm());
                user.setUserType(key.getType());
                if(key.getType().equals(AuthenticationSourceType.LOCAL)) user.setPassword(password);
                dataStore.getUserDao().storeObject(RegisterUserFlow.createUser(user));
                return true;
            }
        }
        return false;
    }

}
