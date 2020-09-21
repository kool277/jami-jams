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
import net.jami.jams.common.annotations.JsonContent;
import net.jami.jams.common.authentication.AuthenticationSource;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.authmodule.AuthModuleKey;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.common.objects.user.UserGroupMapping;
import net.jami.jams.common.objects.user.UserProfile;
import net.jami.jams.server.servlets.api.install.CachedObjects;
import org.json.JSONObject;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

import static net.jami.jams.server.Server.dataStore;
import static net.jami.jams.server.Server.nameServer;
import static net.jami.jams.server.Server.userAuthenticationModule;

@WebServlet("/api/auth/directory/search")
public class SearchDirectoryServlet extends HttpServlet {
    // The search directory function does not automatically create users, this would
    // be costly at this point
    // right now, we will implement it when Jami supports lists of users. this is a
    // work in progress as it
    // requires changes on the name server as well.
    List<UserProfile> userProfiles = new ArrayList<>();

    /**
     *
     */
    @Override
    @JsonContent
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Optional<Integer> page;
        if (req.getParameter("page") == null)
            page = Optional.empty();
        else
            page = Optional.ofNullable(Integer.parseInt(req.getParameter("page")));

        ConcurrentHashMap<AuthModuleKey, AuthenticationSource> authSources = new ConcurrentHashMap<>(
                userAuthenticationModule.getAuthSources());

        if (authSources.size() > 1) {
            authSources.forEach((k, v) -> {
                if (k.getType() == AuthenticationSourceType.LOCAL)
                    authSources.remove(k);
            });
        }

        authSources.forEach((k, v) -> {
            if (req.getParameter("queryString").equals("*"))
                userProfiles = v.searchUserProfiles(req.getParameter("queryString"), "FULL_TEXT_NAME", page);
            else {
                userProfiles = v.searchUserProfiles(req.getParameter("queryString"), "FULL_TEXT_NAME", page);
                if (userProfiles.isEmpty() && userProfiles
                        .addAll(v.searchUserProfiles(req.getParameter("queryString"), "LOGON_NAME", page))) {
                    Set<UserProfile> s = new TreeSet<UserProfile>(new Comparator<UserProfile>() {
                        @Override
                        public int compare(UserProfile o1, UserProfile o2) {
                            if (o1.getUsername().equals(o2.getUsername()))
                                return 0;
                            return 1;
                        }
                    });
                    s.addAll(userProfiles);
                    userProfiles = new ArrayList<>(s);
                }

            }
            userProfiles.parallelStream().forEach(profile -> {
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
            });
        });

        JSONObject obj = new JSONObject();
        obj.put("profiles", userProfiles);
        obj.put("numPages", dataStore.NUM_PAGES);
        if (!userProfiles.isEmpty()) {
            resp.getOutputStream().write((obj.toString()).getBytes());
            resp.setStatus(200);
        } else
            resp.setStatus(204, "No users were found!");
    }
}