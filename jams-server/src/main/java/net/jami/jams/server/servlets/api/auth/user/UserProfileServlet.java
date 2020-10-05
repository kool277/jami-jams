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
package net.jami.jams.server.servlets.api.auth.user;

import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.annotations.JsonContent;
import net.jami.jams.common.objects.user.UserProfile;

import java.io.IOException;

import static net.jami.jams.server.Server.dataStore;
import static net.jami.jams.server.Server.userAuthenticationModule;

@WebServlet("/api/auth/userprofile/*")
@JsonContent
public class UserProfileServlet extends HttpServlet {

    //Get the user profile
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        final UserProfile[] profile = new UserProfile[1];
        String username = req.getPathInfo().replace("/","");

        userAuthenticationModule.getAuthSources().forEach((k, v) -> {
            if (v.getUserProfile(username) != null)
                profile[0] = v.getUserProfile(username);
        });
        dataStore.updateUserGroupMappings(profile[0]);

        if (profile[0] != null) {
            resp.getOutputStream().write(JsonStream.serialize(profile[0]).getBytes());
            resp.setStatus(200);
        } else {
            resp.sendError(500,"User profile was not found!");
            return;
        }
    }
}