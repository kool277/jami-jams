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

package net.jami.jams.server.servlets.api.auth.directory;

import com.jsoniter.output.JsonStream;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.common.annotations.JsonContent;
import net.jami.jams.common.objects.user.UserGroupMapping;
import net.jami.jams.common.objects.user.UserProfile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static net.jami.jams.server.Server.dataStore;
import static net.jami.jams.server.Server.nameServer;
import static net.jami.jams.server.Server.userAuthenticationModule;

@WebServlet("/api/auth/directory/search")
public class SearchDirectoryServlet extends HttpServlet {

    //The search directory function does not automatically create users, this would be costly at this point
    //right now, we will implement it when Jami supports lists of users. this is a work in progress as it
    //requires changes on the name server as well.

    /**
     *
     */
    @Override
    @JsonContent
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        List<UserProfile> userProfiles = new ArrayList<>();
        userAuthenticationModule.getAuthSources().forEach((k, v) -> {
            List<UserProfile> profiles = v.searchUserProfiles(req.getParameter("queryString"), "FULL_TEXT_NAME");
            if(profiles == null || profiles.size() == 0){
                // check logon names if nothing was found
                profiles = v.searchUserProfiles(req.getParameter("queryString"), "LOGON_NAME");
            }
            profiles.parallelStream().forEach(profile -> {
                StatementList statementList = new StatementList();
                StatementElement statementElement = new StatementElement("username", "=", profile.getUsername(), "");
                statementList.addStatement(statementElement);
                List<User> results = new ArrayList<>();
                while (results.size() == 0) {
                    results = dataStore.getUserDao().getObjects(statementList);
                    if (results.size() == 0) {
                        User user = new User();
                        user.setUsername(profile.getUsername());
                        user.setRealm(k.getRealm());
                        user.setUserType(k.getType());
                        user.setAccessLevel(AccessLevel.USER);
                        userAuthenticationModule.createUser(user.getUserType(), user.getRealm(), nameServer, user);
                    } else {
                        profile.setId(results.get(0).getJamiId());
                    }
                }
                userProfiles.add(profile);
            });
        });

        // update user group mappings table
        userProfiles.forEach(profile -> {
            List<UserGroupMapping> mappings = dataStore.getUserGroupMappingsDao().getObjects(null);


            for(UserGroupMapping mapping: mappings) {
                List<String> list = new ArrayList<>();
                if (mapping.getUsername().equals(profile.getUsername())) {
                    String[] splits = mapping.getGroups().split(",");

                    for (int i = 0; i < splits.length; i++) {
                       list.add(splits[i]);
                    }
                }

                if (!list.isEmpty())
                    profile.setGroupMemberships(list);
            }
            dataStore.updateUserProfile(profile);
        });

        resp.getOutputStream().write(JsonStream.serialize(userProfiles).getBytes());
    }
}
