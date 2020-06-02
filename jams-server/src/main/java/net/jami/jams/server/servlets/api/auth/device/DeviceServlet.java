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
package net.jami.jams.server.servlets.api.auth.device;

import com.jsoniter.JsonIterator;
import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.requests.DeviceRegistrationRequest;
import net.jami.jams.common.objects.responses.DeviceRegistrationResponse;
import net.jami.jams.common.objects.responses.DeviceRevocationResponse;
import net.jami.jams.server.core.workflows.RegisterDeviceFlow;
import net.jami.jams.server.core.workflows.RevokeDeviceFlow;

import java.io.IOException;

import static net.jami.jams.server.Server.dataStore;

@WebServlet("/api/auth/device/*")
public class DeviceServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getAttribute("username").toString();
        String deviceId = req.getPathInfo().replace("/","");
        StatementList statementList = new StatementList();
        StatementElement st1 = new StatementElement("owner","=",username,"AND");
        StatementElement st2 = new StatementElement("deviceId","=",deviceId,"");
        statementList.addStatement(st1);
        statementList.addStatement(st2);
        resp.getOutputStream().write(JsonStream.serialize(dataStore.getDeviceDao().getObjects(statementList).get(0)).getBytes());
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        DeviceRegistrationRequest request = JsonIterator.deserialize(req.getInputStream().readAllBytes(), DeviceRegistrationRequest.class);
        DeviceRegistrationResponse devResponse = RegisterDeviceFlow.registerDevice(req.getAttribute("username").toString(),request);
        if(devResponse != null) resp.getOutputStream().write(JsonStream.serialize(devResponse).getBytes());
        else resp.sendError(500,"An exception has occurred while trying to enroll a device!");
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getAttribute("username").toString();
        String deviceId = req.getPathInfo().replace("/","");
        String deviceName = req.getParameter("deviceName");
        StatementList update = new StatementList();
        StatementElement st0 = new StatementElement("deviceName","=",deviceName,"");
        update.addStatement(st0);
        StatementList constraint = new StatementList();
        StatementElement st1 = new StatementElement("owner","=",username,"AND");
        StatementElement st2 = new StatementElement("deviceId","=",deviceId,"");
        update.addStatement(st1);
        update.addStatement(st2);
        if(dataStore.getDeviceDao().updateObject(update,constraint)) resp.setStatus(200);
        else resp.sendError(500,"could not update the device's information!");
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String deviceId = req.getPathInfo().replace("/","");
        DeviceRevocationResponse devResponse = RevokeDeviceFlow.revokeDevice(req.getAttribute("username").toString(),deviceId);
        if(devResponse != null) resp.getOutputStream().write(JsonStream.serialize(devResponse).getBytes());
        else resp.sendError(500,"An exception has occurred while trying to revoke a device!");
    }
}
