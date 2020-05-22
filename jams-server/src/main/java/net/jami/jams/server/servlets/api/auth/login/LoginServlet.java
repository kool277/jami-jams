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
package net.jami.jams.server.servlets.api.auth.login;

import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.authmodule.AuthTokenResponse;

import java.io.IOException;
import java.security.cert.X509Certificate;

import static net.jami.jams.server.servlets.api.auth.login.AuthRequestProcessor.processUsernamePasswordAuth;
import static net.jami.jams.server.servlets.api.auth.login.AuthRequestProcessor.processX509Auth;

@WebServlet("/api/auth/login")
//This method returns the token which is used for all the next calls to the API.
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //There are 3 possible cases here.
        //Case 1: form submitted username/password
        AuthTokenResponse res = null;
        if(req.getParameter("username") != null && req.getParameter("password") != null){
            res = processUsernamePasswordAuth(req.getParameter("username"),req.getParameter("password"));
        }
        //Case 2: Authorization header.
        if(req.getHeader("authorization") != null){
            res = processUsernamePasswordAuth(req.getHeader("authorization"));
        }
        //Case 3 SSL Certificate
        if(req.getAttribute("jakarta.servlet.request.X509Certificate") != null){
            res = processX509Auth((X509Certificate[])req.getAttribute("jakarta.servlet.request.X509Certificate"));
        }
        //Here we catch the need to create a user (this is only possible in 1 & 2).
        if(res == null) resp.sendError(403,"Invalid credentials!");
        else resp.getOutputStream().write(JsonStream.serialize(res).getBytes());
    }
}
