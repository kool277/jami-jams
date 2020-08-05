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

package net.jami.jams.server.servlets.api.admin.directory;

import com.jsoniter.JsonIterator;
import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.annotations.ScopedServletMethod;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.authmodule.AuthModuleKey;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.UserProfile;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Scanner;

import static net.jami.jams.server.Server.userAuthenticationModule;
import static net.jami.jams.server.Server.dataStore;


@WebServlet("/api/admin/directory/entry")
public class DirectoryEntryServlet extends HttpServlet {

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        //Create a user profile.
        String realm = "LOCAL";
        Scanner s = new Scanner(req.getInputStream()).useDelimiter("\\A");
        String result = s.hasNext() ? s.next() : "";
        final JSONObject obj = new JSONObject(result);

        UserProfile userProfile = new UserProfile();
        userProfile.setUsername(obj.get("username").toString());
        userProfile.setFirstName(obj.get("firstName").toString());
        userProfile.setLastName(obj.get("lastName").toString());
        userProfile.setEmail(obj.get("email").toString());
        userProfile.setProfilePicture(obj.get("profilePicture").toString());
        userProfile.setOrganization(obj.get("organization").toString());
        userProfile.setPhoneNumber(obj.get("phoneNumber").toString());
        userProfile.setPhoneNumberExtension(obj.get("phoneNumberExtension").toString());
        userProfile.setFaxNumber(obj.get("faxNumber").toString());
        userProfile.setMobileNumber(obj.get("mobileNumber").toString());
        userProfile.setJamiId(obj.get("jamiId").toString());

        userAuthenticationModule.getAuthSources().get(new AuthModuleKey(realm, AuthenticationSourceType.LOCAL))
            .setUserProfile(userProfile);
        resp.setStatus(200);
        HashMap<String, String> profileName = new HashMap<>();
        profileName.put("username", userProfile.getUsername());
        resp.getOutputStream().write(JsonStream.serialize(profileName).getBytes());
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) {
        //Update a user's profile.
        try{
            //Check if he is AD/LDAP - then return a 500, because we can't update those profile datas.
            UserProfile userProfile = JsonIterator.deserialize(req.getInputStream().readAllBytes(), UserProfile.class);
            StatementList select = new StatementList();
            StatementElement st = new StatementElement("username","=",userProfile.getUsername(),"");
            select.addStatement(st);
            if(dataStore.getUserDao().getObjects(select).get(0).getUserType() != AuthenticationSourceType.LOCAL){
                resp.sendError(500,"The user is not a local user, therefore we cannot change his data!");
                return;
            }
            if(dataStore.updateUserProfile(userProfile))
                resp.setStatus(200);
            else resp.sendError(500,"could not update the users's profile information");
        }
        catch(Exception e){}

    }

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //This method will probably never be implemented.
    }
}
