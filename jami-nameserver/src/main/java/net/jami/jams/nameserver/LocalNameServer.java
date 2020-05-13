package net.jami.jams.nameserver;

import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.jami.NameLookupResponse;
import net.jami.jams.common.jami.NameRegistrationRequest;
import net.jami.jams.common.jami.NameServer;
import net.jami.jams.common.objects.user.User;

import java.util.List;

@Slf4j
public class LocalNameServer implements NameServer {

    private final DataStore dataStore;

    public LocalNameServer(DataStore dataStore) {
        this.dataStore = dataStore;
    }

    //This always returns 200, for obvious reasons.
    @Override
    public Integer registerName(String username, NameRegistrationRequest nameRegistrationRequest) {
        return 200;
    }

    @Override
    public NameLookupResponse getAddressFromName(String username) {
        StatementList statementList = new StatementList();
        StatementElement statementElement = new StatementElement("username","=",username,"");
        statementList.addStatement(statementElement);
        List<User> results = dataStore.getUserDao().getObjects(statementList);
        if(results.size() == 0) return null;
        NameLookupResponse nameLookupResponse = new NameLookupResponse();
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
}
