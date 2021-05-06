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
package net.jami.jams.server.servlets;

import com.jsoniter.JsonIterator;
import com.jsoniter.output.JsonStream;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.annotations.JsonContent;
import net.jami.jams.common.authmodule.AuthTokenResponse;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.serialization.tomcat.TomcatCustomErrorHandler;
import net.jami.jams.server.servlets.api.auth.login.LoginRequest;

import static net.jami.jams.server.Server.certificateAuthority;
import static net.jami.jams.server.Server.dataStore;
import net.jami.jams.common.objects.user.User;


import java.io.IOException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static net.jami.jams.server.servlets.api.auth.login.AuthRequestProcessor.processUsernamePasswordAuth;
import static net.jami.jams.server.servlets.api.auth.login.AuthRequestProcessor.processX509Auth;

@WebServlet("/api/login")
// This method returns the token which is used for all the next calls to the
// API.
public class LoginServlet extends HttpServlet {

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/login Obtain an 0Auth token
     * @apiName postLogin
     * @apiGroup Login
     * @apiParam {header} [authorization] classical HTTP auth header
     * @apiParam {attribute} [X509Certificate] X509 User certificate
     * @apiParam {body} [LoginRequest] username/password sent to server as JSON
     *           object
     *
     * @apiSuccess (200) {body} AuthTokenResponse the 0Auth authentication token
     * @apiError (403) {null} null The user is unauthorized
     */
    @Override
    @JsonContent
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        AuthTokenResponse res = null;
        // Case 1: Authorization header.
        if (req.getHeader("authorization") != null) {
            res = processUsernamePasswordAuth(req.getHeader("authorization"));
        }
        // Case 2 SSL Certificate
        else if (req.getAttribute("jakarta.servlet.request.X509Certificate") != null) {
            res = processX509Auth((X509Certificate[]) req.getAttribute("jakarta.servlet.request.X509Certificate"));
        } else {
            // Case 3: form submitted username/password
            LoginRequest object = JsonIterator.deserialize(req.getInputStream().readAllBytes(), LoginRequest.class);
            if (object.getUsername() != null && object.getPassword() != null) {
                res = processUsernamePasswordAuth(object.getUsername(), object.getPassword());
                StatementList statementList = new StatementList();
                StatementElement statementElement = new StatementElement("username", "=", object.getUsername(), "");
                statementList.addStatement(statementElement);
                List<User> users = dataStore.getUserDao().getObjects(statementList);
                if( users.size() !=0 &&
                        certificateAuthority.getLatestCRL().get() != null &&
                        !users.get(0).getAccessLevelName().equals("ADMIN") &&
                        certificateAuthority.getLatestCRL().get().getRevokedCertificate(users.get(0).getCertificate().getSerialNumber()) != null) {
                    TomcatCustomErrorHandler.sendCustomError(resp, 401, "Invalid credentials provided!");
                }
            }
        }
        resp.setContentType("application/json;charset=UTF-8");
        if (res == null)
            TomcatCustomErrorHandler.sendCustomError(resp, 401, "Invalid credentials provided!");
        else
            resp.getOutputStream().write(JsonStream.serialize(res).getBytes());
    }
}
