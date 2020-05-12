package net.jami.jams.server.core.jaminamserver;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.jami.NameServer;
import net.jami.jams.common.objects.user.User;

import java.util.List;

import static net.jami.jams.server.Server.dataStore;

@Slf4j
public class LocalNameServer implements NameServer {

    //This always returns 200, for obvious reasons.
    @Override
    public Integer registerName(String username) {
        return 200;
    }

    @Override
    public String getAddressFromName(String username) {
        StatementList statementList = new StatementList();
        StatementElement statementElement = new StatementElement("username","=",username,"");
        statementList.addStatement(statementElement);
        List<User> results = dataStore.getUserDao().getObjects(statementList);
        if(results.size() == 0){
            return null;
        }
        return results.get(0).getAddress();
    }

    @Override
    public String getNameFromAddress(String address) {
        StatementList statementList = new StatementList();
        //TODO: Check this.
        StatementElement statementElement = new StatementElement("address","=",address,"");
        statementList.addStatement(statementElement);
        List<User> results = dataStore.getUserDao().getObjects(statementList);
        if(results.size() == 0){
            return null;
        }
        return results.get(0).getUsername();
    }
}
