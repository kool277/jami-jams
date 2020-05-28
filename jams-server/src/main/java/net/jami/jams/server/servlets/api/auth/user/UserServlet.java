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
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static net.jami.jams.server.Server.dataStore;

@WebServlet("/api/auth/user")
public class UserServlet extends HttpServlet {

    //User can "read" his own profile.
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getAttribute("username").toString();
        StatementList select = new StatementList();
        StatementElement st = new StatementElement("username","=",username,"");
        select.addStatement(st);
        resp.getOutputStream().write(JsonStream.serialize(dataStore.getUserDao().getObjects(select).get(0)).getBytes());
    }

    //The user can update 3 fields: password,privatekey,publickey
    //For now we do not consider the possibility for privatekey, publickey for other reasons.
    @Override
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
