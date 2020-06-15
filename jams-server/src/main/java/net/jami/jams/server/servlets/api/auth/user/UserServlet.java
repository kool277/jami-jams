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
import net.jami.jams.common.annotations.ScopedServletMethod;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.User;

import java.io.IOException;

import static net.jami.jams.server.Server.certificateAuthority;
import static net.jami.jams.server.Server.dataStore;
import static net.jami.jams.server.Server.nameServer;

@WebServlet("/api/auth/user")
public class UserServlet extends HttpServlet {

    //User can "read" his own profile.
    /**
     * @apiVersion 1.0.0
     * @api {get} /api/auth/user Get JAMS user info
     * @apiName getUser
     * @apiGroup User
     *
     * @apiSuccess (200) {body} User json user object representation
     * @apiSuccessExample {json} Success-Response:
     * {
     *      "username":"jdoe",
     *      "password":null,
     *      "userType":"AD",
     *      "realm":"savoirfairelinux",
     *      "accessLevel":"USER",
     *      "needsPasswordReset":false,
     *      "ethAddress":"8272773ac",
     *      "ethKey":"192938ae72772ab",
     *      "jamiId":"6e3552723df",
     *      "certificate":"pem_formatted_certificate",
     *      "privateKey":"pem_formatted_key",
     *      "revoked":false
     * }
     * @apiError (500) {null} null could not fetch user information
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getAttribute("username").toString();
        StatementList select = new StatementList();
        StatementElement st = new StatementElement("username","=",username,"");
        select.addStatement(st);
        User user = dataStore.getUserDao().getObjects(select).get(0);
        user.setRevoked(certificateAuthority.getLatestCRL().get().getRevokedCertificate(user.getCertificate().getSerialNumber()) != null);
        resp.getOutputStream().write(JsonStream.serialize(user).getBytes());
    }

    //The user can update 3 fields: password,privatekey,publickey
    //For now we do not consider the possibility for privatekey, publickey for other reasons.
    /**
     * @apiVersion 1.0.0
     * @api {put} /api/auth/user Modify the user's info (for now just the password)
     * @apiName putUser
     * @apiGroup User
     * @apiParam {query} password new password
     *
     * @apiSuccess (200) {null} null password successfully changed
     * @apiError (500) {null} null could not changed password
     */
    @Override
    @ScopedServletMethod(securityGroups = AccessLevel.USER)
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getAttribute("username").toString();
        //Check if he is AD/LDAP - then return a 401, because we can't set such password.
        StatementList select = new StatementList();
        StatementElement st = new StatementElement("username","=",username,"");
        if(dataStore.getUserDao().getObjects(select).get(0).getUserType() != AuthenticationSourceType.LOCAL){
            resp.sendError(500,"The user is not a local user, therefore we cannot change his data!");
            return;
        }
        StatementList update = new StatementList();
        StatementElement st0 = new StatementElement("password","=",req.getParameter("password"),"");
        update.addStatement(st0);
        StatementList constraint = new StatementList();
        StatementElement st1 = new StatementElement("username","=",username,"");
        update.addStatement(st1);
        if(dataStore.getUserDao().updateObject(update,constraint)) resp.setStatus(200);
        else resp.sendError(500,"could not update the users's data field!");
    }
}
