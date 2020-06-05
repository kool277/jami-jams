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
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.authmodule.AuthModuleKey;
import net.jami.jams.common.objects.user.UserProfile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static net.jami.jams.server.Server.userAuthenticationModule;

//This is an endpoint to manipulate directory entry-data, this make sense only for local setups.

@WebServlet("/api/auth/directory/entry")
public class DirectoryEntryServlet extends HttpServlet {

    /**
     * @apiVersion 1.0.0
     * @api {get} /api/auth/directory/entry Return the user's profile within a directory
     * @apiName getDirectoryEntry
     * @apiGroup Directory Entries
     *
     * @apiParam {query} [directory] name of the directory
     * @apiParam {query} [directoryType] type of the directory
     * @apiParam {query} [format] vcard
     * @apiParam {query} [username] username we are looking for
     *
     * @apiSuccess (200) {body} UserProfile json-representation of the user profile
     * @apiSuccess (200) {body} vCard vcard-representation of the user profile
     * @apiError (500) {null} null could not return any authentication sources
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getParameter("directory") != null && req.getParameter("directoryType") != null) {
            UserProfile[] profiles = userAuthenticationModule.getAuthSources()
                    .get(new AuthModuleKey(req.getParameter("directory"), AuthenticationSourceType.fromString(req.getParameter("directoryType"))))
                    .getUserProfile(req.getParameter("username"), "LOGON_NAME");
            if(req.getParameter("format").equals("vcard")){
                resp.getOutputStream().write(profiles[0].getAsVCard().getBytes());
            }
            else resp.getOutputStream().write(JsonStream.serialize(profiles[0]).getBytes());
            return;
        }
        List<UserProfile> userProfiles = new ArrayList<>();
        userAuthenticationModule.getAuthSources().forEach((k, v) -> {
            UserProfile[] profiles = v.getUserProfile(req.getParameter("username"), "LOGON_NAME");
            if (profiles != null && profiles.length != 0) userProfiles.addAll(Arrays.asList(profiles));
        });
        if(req.getParameter("format").equals("vcard")){
            resp.getOutputStream().write(userProfiles.get(0).getAsVCard().getBytes());
        }
        else resp.getOutputStream().write(JsonStream.serialize(userProfiles.get(0)).getBytes());
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //This should work to modify a profile only in the case of a LOCAL directory.
    }
}
