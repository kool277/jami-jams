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
package net.jami.jams.server.servlets.api.install;

import com.jsoniter.JsonIterator;
import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.authmodule.AuthTokenResponse;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.requests.CredentialsRequest;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.User;

import java.io.IOException;

import static net.jami.jams.server.Server.dataStore;
import static net.jami.jams.server.servlets.api.auth.login.AuthRequestProcessor.processUsernamePasswordAuth;

@Slf4j
@WebServlet("/api/install/start")
public class StartInstallServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //Here we must decide which page to show - login or sign-up
        if(dataStore != null && dataStore.getUserDao() != null && !dataStore.getUserDao().getObjects(null).isEmpty())
            resp.setHeader("showLogin","true");
        else
            resp.setHeader("showLogin","false");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        CredentialsRequest credentialsRequest = JsonIterator.deserialize(req.getInputStream().readAllBytes(),CredentialsRequest.class);
        AuthTokenResponse res = null;
        if(credentialsRequest.getUsername() != null && credentialsRequest.getPassword() != null){
            res = processUsernamePasswordAuth(credentialsRequest.getUsername(),credentialsRequest.getPassword());
        }
        resp.setHeader("endpoint",CachedObjects.endpoint);
        if(res == null) resp.sendError(403,"Could not authenticate!");
        else resp.getOutputStream().write(JsonStream.serialize(res).getBytes());
    }

    //This is the ONLY case where we write directy to the DB
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if(dataStore.getUserDao().getObjects(null).size() != 0){
            resp.sendError(500,"We have tried to create an administrative account where one already exists!");
            return;
        }
        CredentialsRequest credentialsRequest = JsonIterator.deserialize(req.getInputStream().readAllBytes(),CredentialsRequest.class);
        //The admin user has no X509 properties.
        User user = new User();
        user.setUsername(credentialsRequest.getUsername());
        user.setPassword(credentialsRequest.getPassword());
        user.setUserType(AuthenticationSourceType.LOCAL);
        user.setRealm("LOCAL");
        user.setAccessLevel(AccessLevel.ADMIN);
        dataStore.getUserDao().storeObject(user);
        AuthTokenResponse res = processUsernamePasswordAuth(user.getUsername(),user.getPassword());
        CachedObjects.endpoint = "/api/install/ca";
        resp.getOutputStream().write(JsonStream.serialize(res).getBytes());
    }
}
