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
package net.jami.jams.ldap.connector.service;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.objects.user.UserProfile;
import net.jami.jams.ldap.connector.LDAPConnector;
import org.ldaptive.Connection;
import org.ldaptive.ConnectionFactory;
import org.ldaptive.LdapEntry;
import org.ldaptive.SearchOperation;
import org.ldaptive.SearchRequest;
import org.ldaptive.SearchResponse;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Iterator;

@Slf4j
public class UserProfileService {

    private static final HashMap<String,String> fieldMap = LDAPConnector.settings.getFieldMappings();
    private final ConnectionFactory connectionFactory;

    public UserProfileService(ConnectionFactory connectionFactory) {
        this.connectionFactory = connectionFactory;
    }

    public UserProfile[] getUserProfile(String queryString, String field){
        UserProfile[] profiles = null;
        Connection connection = null;
        try {
            queryString = URLEncoder.encode(queryString,StandardCharsets.UTF_8).replace("%","\\");
            connection = connectionFactory.getConnection();
            try {
                connection.open();
                SearchOperation search = new SearchOperation(connectionFactory);
                SearchResponse res = search.execute(buildRequest(queryString,field));
                if (res.getEntries().size() > 0) profiles = new UserProfile[res.getEntries().size()];
                else return null;
                Iterator<LdapEntry> iterator = res.getEntries().iterator();
                int i = 0;
                while(iterator.hasNext()){
                    profiles[i] = profileFromResponse(iterator.next());
                    i++;
                }
                return profiles;
            } catch (Exception e) {
                log.error("Could not search LDAP directory with error " + e.toString());
                return null;
            }
        }
        catch (Exception e){
            log.info("Failed to search LDAP directory with error " + e.toString());
            return null;
        }
        finally {
            connection.close();
        }
    }


    public static SearchRequest buildRequest(String queryString, String field) {

        if (!queryString.startsWith("*"))
            queryString = queryString.concat("*");

        if(field.equals("LOGON_NAME")) {
            return SearchRequest.builder()
                    .dn(LDAPConnector.settings.getBaseDN())
                    .filter("(&(uid=" + queryString + "))")
                    .build();
        }
        if(field.equals("FULL_TEXT_NAME")){
            return SearchRequest.builder()
                    .dn(LDAPConnector.settings.getBaseDN())
                    .filter("(|(givenName=" + queryString + ")(sn="+queryString+")")
                    .build();
        }
        return null;
    }

    public static UserProfile profileFromResponse(LdapEntry entry){
        //Use reflection to remap.
        try {
            UserProfile userProfile = new UserProfile();
            for (String attribute : entry.getAttributeNames()) {
                if(fieldMap.containsKey(attribute)) {
                    UserProfile.exposedMethods.get("set" + fieldMap.get(attribute)).invoke(userProfile, entry.getAttribute(attribute).getStringValue());
                }
            }
            return userProfile;
        }
        catch (Exception e){
            log.error("An error occured while trying to invoke methods: " + e.toString());
            return null;
        }
    }
}
