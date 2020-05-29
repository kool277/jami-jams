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
package net.jami.jams.server.servlets.api.admin.update;

import com.jsoniter.output.JsonStream;
import net.jami.jams.common.updater.FullSystemStatusResponse;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static net.jami.jams.server.Server.appUpdater;

@WebServlet("/api/update")
public class UpdateServlet extends HttpServlet {

    //Return the current version number and the available version number.
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        FullSystemStatusResponse response = new FullSystemStatusResponse();
        response.setLocalVersions(appUpdater.getLocalVersions());
        response.setRemoteVersions(appUpdater.getRemoteVersions());
        response.setUpdateAvailable(appUpdater.getUpdateAvailable());
        resp.getOutputStream().write(JsonStream.serialize(response).getBytes());
    }

    //This is the do-update button.
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
        if(appUpdater.getUpdateAvailable()){
            appUpdater.doUpdate();
        }
    }
}
