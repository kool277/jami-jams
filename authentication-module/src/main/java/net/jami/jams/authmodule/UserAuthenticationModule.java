package net.jami.jams.authmodule;

import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.authentication.AuthenticationSource;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.authmodule.AuthModuleKey;
import net.jami.jams.common.authmodule.AuthenticationModule;
import net.jami.jams.common.authmodule.AuthenticationResult;
import net.jami.jams.common.cryptoengineapi.CertificateAuthority;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.jami.NameServer;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.common.utils.LibraryLoader;

import java.security.cert.X509Certificate;
import java.util.HashMap;


@Slf4j
public class UserAuthenticationModule implements AuthenticationModule {
    //This contains the DOMAIN-SOURCE.
    //In general there is at most 2 here.
    private final static String LDAP_CONNECTOR_CLASS = "net.jami.jams.ldap.connector.LDAPConnector";
    private final static String AD_CONNECTOR_CLASS = "net.jami.jams.ad.connector.ADConnector";
    public static DataStore datastore;
    public static CertificateAuthority certificateAuthority;
    private final TokenController tokenController = new TokenController();

    private final HashMap<AuthModuleKey, AuthenticationSource> authenticationSources = new HashMap<>();

    public UserAuthenticationModule(DataStore dataStore, CertificateAuthority certificateAuthority) {
        UserAuthenticationModule.datastore = dataStore;
        UserAuthenticationModule.certificateAuthority = certificateAuthority;
        authenticationSources.put(new AuthModuleKey("LOCAL",AuthenticationSourceType.LOCAL),datastore);
        log.info("Started authentication module - default local source is already enabled!");
    }

    @Override
    public void attachAuthSource(AuthenticationSourceType type, String settings) {
        switch (type){
            case AD: loadAuthConnector(AD_CONNECTOR_CLASS,settings); break;
            case LDAP: loadAuthConnector(LDAP_CONNECTOR_CLASS,settings); break;
            default: break;
        }
    }

    private void loadAuthConnector(String className, String settings){
        try {
            Class<?> cls = LibraryLoader.classLoader.loadClass(className);
            AuthenticationSource source = (AuthenticationSource) cls.getConstructor(String.class).newInstance(settings);
            authenticationSources.put(new AuthModuleKey(source.getInfo().getRealm(),source.getInfo().getAuthenticationSourceType()), source);
        }
        catch (Exception e){
            log.error("Could not load connector " + className + " with reason: " + e.toString());
        }
    }

    @Override
    public AuthenticationResult authenticateUser(String username, String password) {
        AuthenticationResult res = new AuthenticationResult(false,null);
        if(datastore.userExists(username)){
            StatementList statementList = new StatementList();
            StatementElement statementElement = new StatementElement("username","=",username,"");
            statementList.addStatement(statementElement);
            User user = datastore.getUserDao().getObjects(statementList).get(0);
            res.setAuthenticated(authenticationSources.get(new AuthModuleKey(user.getRealm(),user.getUserType()))
                    .authenticate(username,password));
            //Generate token
            res.setToken(tokenController.generateToken(user.getUsername(),res.getExpires()));
            return res;
        }
        //The second case is much more violent, because we don't know in advance "where" this user comes
        //from, so we have to infer (this is only really true for "users", all others are usually pre-marked)
        //This is also the case when we store the user into the DAO - because he never existed before.
        for(AuthModuleKey key : authenticationSources.keySet()){
            if(authenticationSources.get(key).authenticate(username,password)){
                User user = new User();
                user.setUsername(username);
                user.setAccessLevel(AccessLevel.USER);
                user.setRealm(key.getRealm());
                user.setUserType(key.getType());
                RegisterUserFlow.createUser(user,null);
                res.setToken(tokenController.generateToken(user.getUsername(),res.getExpires()));
                res.setAuthenticated(true);
                return res;
            }
        }
        return res;
    }

    @Override
    public AuthenticationResult authenticateUser(X509Certificate[] certificates) {
        return null;
    }

    @Override
    public String validateAndGetUsername(String token) {
        return tokenController.getUsernameFromToken(token);
    }

    @Override
    public HashMap<AuthModuleKey, AuthenticationSource> getAuthSources(){
        return authenticationSources;
    }

    @Override
    public boolean testModuleConfiguration(AuthenticationSourceType type, String settings) {
        try {
            String className = "";
            if (type.equals(AuthenticationSourceType.AD)) className = AD_CONNECTOR_CLASS;
            if (type.equals(AuthenticationSourceType.LDAP)) className = LDAP_CONNECTOR_CLASS;
            Class<?> cls = LibraryLoader.classLoader.loadClass(className);
            AuthenticationSource source = (AuthenticationSource) cls.getConstructor(String.class).newInstance(settings);
            return source.test();
        }
        catch (Exception e){
            log.error("The testing of the source was unsuccessful!");
            return false;
        }
    }

    @Override
    public boolean createUser(AuthenticationSourceType type, String realm, NameServer nameServer, User user) {
        //This concept doesn't exist for LDAP or AD or any other hosted directory, in this case we simply run
        //very theoretically, we should allow LDAP to publish to the public registry, but this is a lot
        //more complex.
        return RegisterUserFlow.createUser(user,nameServer);
    }

}
