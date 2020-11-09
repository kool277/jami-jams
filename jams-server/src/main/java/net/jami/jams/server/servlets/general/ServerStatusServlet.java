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
package net.jami.jams.server.servlets.general;

import com.jsoniter.output.JsonStream;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.annotations.JsonContent;
import net.jami.jams.server.Server;

import java.io.IOException;
import java.util.HashMap;

@WebServlet("/api/info")
public class ServerStatusServlet extends HttpServlet {

    @Override
    @JsonContent
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
       HashMap<String,String> statusInfo = new HashMap<>();
        statusInfo.put("installed",String.valueOf(Server.isInstalled.get()));
        resp.getOutputStream().write(JsonStream.serialize(statusInfo).getBytes());
    }
}
