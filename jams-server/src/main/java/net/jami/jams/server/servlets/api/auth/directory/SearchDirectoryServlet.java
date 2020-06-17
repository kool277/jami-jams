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
import net.jami.jams.common.objects.user.UserProfile;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static net.jami.jams.server.Server.userAuthenticationModule;

@WebServlet("/api/auth/directory/search")
public class SearchDirectoryServlet extends HttpServlet {

    //The search directory function does not automatically create users, this would be costly at this point
    //right now, we will implement it when Jami supports lists of users. this is a work in progress as it
    //requires changes on the name server as well.
    /**
     * @apiVersion 1.0.0
     * @api {get} /api/auth/directory/search Search profiles within a directory
     * @apiName getDirectoryEntries
     * @apiGroup Directory Search
     *
     * @apiParam {query} [queryString] the full-text query
     *
     * @apiSuccess (200) {body} UserProfile[] json-representation of the user profiles
     * @apiSuccessExample {json} Success-Response:
     * [{
     *       "username":"jdoe",
     *       "firstName":"John",
     *       "lastName":"Doe",
     *       "phoneNumber":"+1-514-000-0000",
     *       "phoneNumberExtension":"363",
     *       "mobileNumber":"+1-514-000-0000",
     *       "faxNumber":"+1-514-000-0000",
     *       "profilePicture":"base64_encoded_picture",
     *       "email":"jdoe@savoirfairelinux.com",
     *       "organization":"SFL"
     *  }]
     * @apiError (500) {null} null could not return any authentication sources
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<UserProfile> userProfiles = new ArrayList<>();
        userAuthenticationModule.getAuthSources().forEach( (k,v) ->{
                UserProfile[] profiles = v.getUserProfile(req.getParameter("queryString"),"FULL_TEXT_NAME");
                if(profiles != null && profiles.length != 0) userProfiles.addAll(Arrays.asList(profiles));
        });

        // check logon names if nothing was found
        if (userProfiles.isEmpty()) {
            userAuthenticationModule.getAuthSources().forEach( (k,v) ->{
                UserProfile[] profiles = v.getUserProfile(req.getParameter("queryString"),"LOGON_NAME");
                if(profiles != null && profiles.length != 0) userProfiles.addAll(Arrays.asList(profiles));
            });
        }
        resp.getOutputStream().write(JsonStream.serialize(userProfiles).getBytes());
    }
}
