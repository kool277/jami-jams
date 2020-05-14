package net.jami.jams.nameserver;

import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.authmodule.AuthenticationModule;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.jami.NameLookupResponse;
import net.jami.jams.common.jami.NameRegistrationRequest;
import net.jami.jams.common.jami.NameServer;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.common.objects.user.UserProfile;

import java.util.List;

@Slf4j
public class LocalNameServer implements NameServer {

    private final DataStore dataStore;
    private final String nameserverURI;
    private final AuthenticationModule authenticationModule;

    public LocalNameServer(DataStore dataStore, AuthenticationModule authenticationModule, String nameserverURI) {
        this.dataStore = dataStore;
        this.nameserverURI = nameserverURI;
        this.authenticationModule = authenticationModule;
    }

    //This always returns 200, for obvious reasons.
    @Override
    public Integer registerName(String username, NameRegistrationRequest nameRegistrationRequest) {
        return 200;
    }

    @Override
    public NameLookupResponse getAddressFromName(String username) {
        NameLookupResponse nameLookupResponse = null;
        StatementList statementList = new StatementList();
        StatementElement statementElement = new StatementElement("username","=",username,"");
        statementList.addStatement(statementElement);
        List<User> results = dataStore.getUserDao().getObjects(statementList);
        if(results.size() == 0){
            //Reattempt resolution via directory lookups.
            final User user = new User();
            authenticationModule.getAuthSources().forEach( (k,v) ->{
                UserProfile[] profiles = v.getUserProfile(username,"LOGON_NAME");
                if(profiles != null && profiles.length == 1){
                    user.setRealm(k.getRealm());
                    user.setUserType(k.getType());
                    user.setAccessLevel(AccessLevel.USER);
                    authenticationModule.createUser(user.getUserType(),user.getRealm(),this,user);
                }
            });
            if(user.getUsername() == null) return null;
            //resolve again in the database to be sure.
            results = dataStore.getUserDao().getObjects(statementList);
            if(results.size() == 0) return null;
        }
        nameLookupResponse = new NameLookupResponse();
        nameLookupResponse.setName(results.get(0).getUsername());
        nameLookupResponse.setAddr(results.get(0).getJamiId());
        return nameLookupResponse;
    }

    @Override
    public String getNameFromAddress(String address) {
        StatementList statementList = new StatementList();
        StatementElement statementElement = new StatementElement("ethAddress","=",address,"");
        statementList.addStatement(statementElement);
        List<User> results = dataStore.getUserDao().getObjects(statementList);
        if(results.size() == 0) return null;
        return results.get(0).getUsername();
    }

    @Override
    public String getURI() {
        return this.nameserverURI;
    }
}
