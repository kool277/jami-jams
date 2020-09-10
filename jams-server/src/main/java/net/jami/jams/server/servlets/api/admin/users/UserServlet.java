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
package net.jami.jams.server.servlets.api.admin.users;
import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.authmodule.PasswordUtil;
import net.jami.jams.common.annotations.JsonContent;
import net.jami.jams.common.annotations.ScopedServletMethod;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.responses.DeviceRevocationResponse;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.server.core.workflows.RevokeUserFlow;
import org.apache.commons.codec.binary.Base64;
import org.json.JSONObject;
        
import java.io.IOException;
import java.util.HashMap;
import java.util.stream.Collectors;
        
import static net.jami.jams.server.Server.certificateAuthority;
import static net.jami.jams.server.Server.dataStore;
import static net.jami.jams.server.Server.nameServer;
import static net.jami.jams.server.Server.userAuthenticationModule;
@WebServlet("/api/admin/user")
public class UserServlet extends HttpServlet {
    //Get the user
    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    @JsonContent
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        StatementList statementList = new StatementList();
        StatementElement st1 = new StatementElement("username","=",req.getParameter("username"),"");
        statementList.addStatement(st1);
        if (!dataStore.getUserDao().getObjects(statementList).isEmpty()) {
            User user = dataStore.getUserDao().getObjects(statementList).get(0);
            if (certificateAuthority.getLatestCRL().get() != null)
                user.setRevoked(certificateAuthority.getLatestCRL().get().getRevokedCertificate(user.getCertificate().getSerialNumber()) != null);
            else user.setRevoked(false);
            if (!user.getNeedsPasswordReset() && req.getParameter("needPW") != null) {
                String pw = PasswordUtil.hashPassword(req.getParameter("password"), Base64.decodeBase64(user.getSalt()));
                StatementList update = new StatementList();
                StatementElement st0 = new StatementElement("password", "=", pw, "");
                update.addStatement(st0);
                StatementList constraint = new StatementList();
                StatementElement st = new StatementElement("username", "=", req.getParameter("username"), "");
                constraint.addStatement(st);
                StatementElement st2 = new StatementElement("needsPasswordReset", "=", "true", "");
                update.addStatement(st2);
                // refresh variable
                dataStore.getUserDao().updateObject(update, constraint);
                user = dataStore.getUserDao().getObjects(statementList).get(0);
            }
            resp.getOutputStream().write(JsonStream.serialize(user).getBytes());
            resp.setStatus(200);
        } else {
            resp.sendError(404, "Could not obtain user!");
        }
    }
    //Create an internal user - this is always technically available, because internal users have the right to exist.
    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        final JSONObject obj = new JSONObject(req.getReader().lines().collect(Collectors.joining(System.lineSeparator())));
        String pw = obj.getString("password");
        if (!pw.isEmpty()) {
            User user = new User();
            user.setUsername(obj.getString("username"));
            user.setNeedsPasswordReset(true);
            byte[] salt = PasswordUtil.generateSalt();
            pw = PasswordUtil.hashPassword(pw, salt);
            user.setPassword(pw);
            user.setSalt(Base64.encodeBase64String(salt));
            user.setRealm("LOCAL");
            user.setUserType(AuthenticationSourceType.LOCAL);
            if(userAuthenticationModule.createUser(user.getUserType(),user.getRealm(),nameServer,user)){
                HashMap<String,String> statusInfo = new HashMap<>();
                statusInfo.put("password", pw);
                resp.getOutputStream().write(JsonStream.serialize(statusInfo).getBytes());
        
                resp.setStatus(200);
        
                return;
        
            }
        
        }
        
        
        resp.sendError(500,"Could not create a user successfully!");
    }
    //Update user data.
    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String username = req.getParameter("username");
        //Check if he is AD/LDAP - then return a 403, because we can't set such password.
        if(dataStore.getUserDao().getObjects(null).get(0).getUserType() != AuthenticationSourceType.LOCAL){
            resp.sendError(500,"The user is not a local user, therefore we cannot change his data!");
            return;
        }
        StatementList update = new StatementList();
        StatementElement st0 = new StatementElement("password","=",PasswordUtil.hashPassword(req.getParameter("password"), Base64.decodeBase64(dataStore.getUserDao().getObjects(null).get(0).getSalt())),"");
        update.addStatement(st0);
        StatementList constraint = new StatementList();
        StatementElement st1 = new StatementElement("username","=",username,"");
        constraint.addStatement(st1);
        if(dataStore.getUserDao().updateObject(update,constraint)) resp.setStatus(200);
        else resp.sendError(500,"could not update the users's data field!");
    }
    //Revoke a user.
    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        DeviceRevocationResponse devResponse = RevokeUserFlow.revokeUser(req.getParameter("username"));
        if(devResponse != null && devResponse.isSuccess()) resp.getOutputStream().write(JsonStream.serialize(devResponse).getBytes());
        else resp.sendError(500,"An exception has occurred while trying to revoke a user!");
    }
}