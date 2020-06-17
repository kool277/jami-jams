/*
* Copyright (C) 2020 by Savoir-faire Linux
* Authors: William Enright <william.enright@savoirfairelinux.com>
*          Ndeye Anna Ndiaye <anna.ndiaye@savoirfairelinux.com>
*          Johnny Flores <johnny.flores@savoirfairelinux.com>
*          Mohammed Raza <mohammed.raza@savoirfairelinux.com>
*          Felix Sidokhine <felix.sidokhine@savoirfairelinux.com>
*
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
package net.jami.jams.nameserver;

import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.authmodule.AuthModuleKey;
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

    private static final String NAME_SERVER_PATH = "/api/nameserver";

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
            for(AuthModuleKey key : authenticationModule.getAuthSources().keySet()){
                UserProfile[] profiles = authenticationModule.getAuthSources().get(key).getUserProfile(username,"LOGON_NAME");
                if(profiles != null && profiles.length == 1){
                    user.setUsername(username);
                    user.setRealm(key.getRealm());
                    user.setUserType(key.getType());
                    user.setAccessLevel(AccessLevel.USER);
                    authenticationModule.createUser(user.getUserType(),user.getRealm(),this,user);
                    break;
                }
            }
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
        StatementElement statementElement = new StatementElement("jamiId","=",address,"");
        statementList.addStatement(statementElement);
        List<User> results = dataStore.getUserDao().getObjects(statementList);
        if(results.size() == 0) return null;
        return results.get(0).getUsername();
    }

    @Override
    public String getURI() {
        return this.nameserverURI + NAME_SERVER_PATH;
    }
}
