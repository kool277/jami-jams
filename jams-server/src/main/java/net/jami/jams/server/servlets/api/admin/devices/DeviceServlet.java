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
package net.jami.jams.server.servlets.api.admin.devices;

import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.annotations.ScopedServletMethod;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.responses.DeviceRevocationResponse;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.server.core.workflows.RevokeDeviceFlow;

import java.io.IOException;

import static net.jami.jams.server.Server.dataStore;

@WebServlet("/api/admin/device")
public class DeviceServlet extends HttpServlet {

    //Get a detailed device info.
    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getParameter("username");
        String deviceId = req.getParameter("deviceId");
        StatementList statementList = new StatementList();
        StatementElement st1 = new StatementElement("owner","=",username,"AND");
        StatementElement st2 = new StatementElement("deviceId","=",deviceId,"");
        statementList.addStatement(st1);
        statementList.addStatement(st2);
        resp.getOutputStream().write(JsonStream.serialize(dataStore.getDeviceDao().getObjects(statementList).get(0)).getBytes());
    }

    //Update device data.
    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getParameter("username");
        String deviceId = req.getParameter("deviceId");
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

    //Revoke/delete a device.
    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        DeviceRevocationResponse devResponse = RevokeDeviceFlow.revokeDevice(req.getParameter("username").toString(),req.getParameter("deviceId"));
        if(devResponse != null) resp.getOutputStream().write(JsonStream.serialize(devResponse).getBytes());
        else resp.sendError(500,"An exception has occurred while trying to revoke a device!");
    }
}
