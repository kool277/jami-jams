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

import static net.jami.jams.server.Server.dataStore;

import lombok.extern.slf4j.Slf4j;

import net.jami.datastore.main.DataStore;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.user.UserProfile;
import net.jami.jams.ldap.connector.LDAPConnector;

import org.ldaptive.Connection;
import org.ldaptive.ConnectionFactory;
import org.ldaptive.LdapEntry;
import org.ldaptive.SearchOperation;
import org.ldaptive.SearchRequest;
import org.ldaptive.SearchResponse;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
public class UserProfileService {
    private final ConnectionFactory connectionFactory;

    public UserProfileService(ConnectionFactory connectionFactory) {
        this.connectionFactory = connectionFactory;
    }

    public List<UserProfile> getUserProfile(
            String queryString, String field, boolean exactMatch, Optional<Integer> page) {
        Connection connection = null;
        try {
            queryString =
                    new String(
                            queryString.getBytes(StandardCharsets.UTF_8),
                            StandardCharsets.ISO_8859_1);
            connection = connectionFactory.getConnection();
            try {
                connection.open();
                SearchOperation search = new SearchOperation(connectionFactory);
                SearchResponse res = search.execute(buildRequest(queryString, field, exactMatch));

                DataStore.NUM_PAGES =
                        (Integer) res.getEntries().size() / DataStore.RESULTS_PER_PAGE;
                if (res.getEntries().size() % DataStore.RESULTS_PER_PAGE != 0)
                    DataStore.NUM_PAGES++;

                if (page.isPresent() && !res.getEntries().isEmpty()) {
                    if (res.getEntries().size() < DataStore.RESULTS_PER_PAGE)
                        res = res.subResult(0, res.getEntries().size());
                    else if (page.get() * DataStore.RESULTS_PER_PAGE > res.getEntries().size())
                        res =
                                res.subResult(
                                        (page.get() - 1) * DataStore.RESULTS_PER_PAGE,
                                        res.getEntries().size());
                    else
                        res =
                                res.subResult(
                                        (page.get() - 1) * DataStore.RESULTS_PER_PAGE,
                                        (page.get() * DataStore.RESULTS_PER_PAGE));
                }

                if (res.getEntries().size() == 0) return new ArrayList<>();
                List<UserProfile> profilesFromResponse =
                        res.getEntries().stream()
                                .map(UserProfileService::profileFromResponse)
                                .collect(Collectors.toList());
                for (UserProfile p : profilesFromResponse) {
                    StatementList statementList = new StatementList();
                    StatementElement st =
                            new StatementElement("username", "=", p.getUsername(), "");
                    statementList.addStatement(st);

                    if (dataStore.getUserProfileDao().getObjects(statementList).isEmpty())
                        dataStore.getUserProfileDao().storeObject(p);
                }

                return profilesFromResponse;
            } catch (Exception e) {
                log.error("Could not search LDAP directory with error " + e);
                return null;
            }
        } catch (Exception e) {
            log.info("Failed to search LDAP directory with error " + e);
            return null;
        } finally {
            connection.close();
        }
    }

    public static SearchRequest buildRequest(String queryString, String field, boolean exactMatch) {

        if (!exactMatch) {
            if (!queryString.startsWith("*")) queryString = "*".concat(queryString);
            if (!queryString.endsWith("*")) queryString = queryString.concat("*");
        }

        if (field.equals("LOGON_NAME")) {
            return SearchRequest.builder()
                    .dn(LDAPConnector.settings.getBaseDN())
                    .filter("(&(uid=" + queryString + "))")
                    .build();
        }
        if (field.equals("FULL_TEXT_NAME")) {
            return SearchRequest.builder()
                    .dn(LDAPConnector.settings.getBaseDN())
                    .filter("(|(givenName=" + queryString + ")(sn=" + queryString + ")")
                    .build();
        }
        return null;
    }

    public static UserProfile profileFromResponse(LdapEntry entry) {
        // Use reflection to remap.
        HashMap<String, String> fieldMap = LDAPConnector.settings.getFieldMappings();

        try {
            UserProfile userProfile = new UserProfile();
            for (String attribute : entry.getAttributeNames()) {
                if (fieldMap.containsKey(attribute)) {
                    UserProfile.exposedMethods
                            .get("set" + fieldMap.get(attribute))
                            .invoke(userProfile, entry.getAttribute(attribute).getStringValue());
                }
            }
            userProfile.setDefaultValues();
            return userProfile;
        } catch (Exception e) {
            log.error("An error occurred while trying to invoke methods: " + e);
            return null;
        }
    }
}
