/*
 * Copyright (C) 2020-2024 by Savoir-faire Linux
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

import net.jami.datastore.main.DataStore;
import net.jami.jams.common.objects.user.UserProfile;
import net.jami.jams.ldap.connector.LDAPConnector;
import net.jami.jams.server.core.workflows.RevokeUserFlow;

import org.ldaptive.Connection;
import org.ldaptive.ConnectionFactory;
import org.ldaptive.LdapEntry;
import org.ldaptive.SearchOperation;
import org.ldaptive.SearchRequest;
import org.ldaptive.SearchResponse;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
public class UserProfileService {
    private static DataStore dataStore;
    private final ConnectionFactory connectionFactory;

    public UserProfileService(DataStore dataStore, ConnectionFactory connectionFactory) {
        UserProfileService.dataStore = dataStore;
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
            connection.open();
            SearchOperation search = new SearchOperation(connectionFactory);
            SearchResponse res = search.execute(buildRequest(queryString, field, exactMatch));

            Collection<LdapEntry> entries = getEntriesPage(res, page);

            if (entries.isEmpty()) return new ArrayList<>();

            List<UserProfile> profilesFromResponse =
                    entries.stream()
                            .map(UserProfileService::profileFromResponse)
                            .collect(Collectors.toList());
            for (UserProfile p : profilesFromResponse) {
                dataStore.getUserProfileDao().insertIfNotExists(p);
            }

            return profilesFromResponse;
        } catch (Exception e) {
            log.info("Failed to search LDAP directory with error " + e);
            return null;
        } finally {
            connection.close();
        }
    }

    private Collection<LdapEntry> getEntriesPage(SearchResponse res, Optional<Integer> page) {
        int size = res.getEntries().size();

        DataStore.NUM_PAGES = (Integer) size / DataStore.RESULTS_PER_PAGE;
        if (size % DataStore.RESULTS_PER_PAGE != 0) DataStore.NUM_PAGES++;

        if (page.isEmpty() || size == 0) {
            return res.getEntries();
        }

        if (size < DataStore.RESULTS_PER_PAGE) res = res.subResult(0, size);
        else if (page.get() * DataStore.RESULTS_PER_PAGE > size)
            res = res.subResult((page.get() - 1) * DataStore.RESULTS_PER_PAGE, size);
        else
            res =
                    res.subResult(
                            (page.get() - 1) * DataStore.RESULTS_PER_PAGE,
                            (page.get() * DataStore.RESULTS_PER_PAGE));

        return res.getEntries();
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

    public void synchronizeUsersWithLDAP() {
        log.info("Synchronizing LDAP user profiles");
        // Fetcg all users from the LDAP
        List<UserProfile> profilesFromLDAP =
                getUserProfile("*", "LOGON_NAME", false, Optional.empty());
        // Do not revoke users if there is an error, the LDAP server could be down.
        if (profilesFromLDAP != null) {
            // There is a use case where a user is not in the LDAP server but is in the database.
            // When this happens, we need to revoke the user from the database.
            List<UserProfile> profilesFromDatabase =
                    dataStore.getUserProfileDao().getAllUserProfile();
            for (UserProfile p : profilesFromDatabase) {
                if (profilesFromLDAP.stream()
                        .noneMatch(r -> r.getUsername().equals(p.getUsername()))) {
                    log.info("Revoking user " + p.getUsername() + " from the database.");
                    RevokeUserFlow.revokeUser(p.getUsername());
                    // We also remove the user from the local_directory table to avoid duplicate
                    // revocations
                    dataStore.getUserProfileDao().deleteUserProfile(p.getUsername());
                }
            }
        }
    }
}
