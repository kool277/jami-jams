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

import java.util.List;
import java.util.Optional;

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
    public List<UserProfile> searchUserProfiles(String queryString, String field, Optional<Integer> page) {
        return userProfileService.getUserProfile(queryString,field,false, page);
    }

    @Override
    public UserProfile getUserProfile(String username) {
        List<UserProfile> results = userProfileService.getUserProfile(username,"LOGON_NAME",true, Optional.empty());
        if(results == null || results.size() != 1) return null;
        return results.get(0);
    }

    @Override
    public boolean setUserProfile(UserProfile userProfile) {
        //does nothing since we cannot edit LDAP profiles.
        return false;
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
        return (searchUserProfiles("*","LOGON_NAME", Optional.empty()).size() != 0);
    }


    @Override
    public boolean updatePassword(User user, String password) {
        return false;
    }
}
