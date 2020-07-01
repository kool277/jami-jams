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
import net.jami.jams.common.annotations.ScopedServletMethod;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.objects.requests.CreateAuthSourceRequest;
import net.jami.jams.common.objects.user.AccessLevel;

import java.io.IOException;

import static net.jami.jams.server.Server.userAuthenticationModule;

@WebServlet("/api/install/auth")
@Slf4j
public class CreateAuthSourceServlet extends HttpServlet {

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doGet(req, resp);
    }

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        CreateAuthSourceRequest authSourceRequest = JsonIterator.deserialize(
                req.getInputStream().readAllBytes(),CreateAuthSourceRequest.class);
        CachedObjects.localAuthSettings = null;
        CachedObjects.activeDirectorySettings = null;
        CachedObjects.ldapSettings = null;
        boolean error = false;
        switch (authSourceRequest.getType()){
            case LOCAL:
                CachedObjects.localAuthSettings = authSourceRequest.getLocalAuthSettings();
                break;
            case LDAP:
                if(userAuthenticationModule.testModuleConfiguration(AuthenticationSourceType.LDAP,
                        JsonStream.serialize(authSourceRequest.getLdapSettings()))){
                    CachedObjects.ldapSettings = authSourceRequest.getLdapSettings();
                }
                else error = true;
                break;
            case AD:
                if(userAuthenticationModule.testModuleConfiguration(AuthenticationSourceType.AD,
                        JsonStream.serialize(authSourceRequest.getActiveDirectorySettings()))) {
                    CachedObjects.activeDirectorySettings = authSourceRequest.getActiveDirectorySettings();
                }
                else error = true;
                break;
        }
        if(error) resp.sendError(500,"The supplied configuration is invalid or the connectivity tests has failed");
        else CachedObjects.endpoint = "/api/install/settings";
    }
}
