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

import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.devices.Device;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.servlets.ScopedServlet;

import java.io.IOException;
import java.util.List;

import static net.jami.jams.server.Server.certificateAuthority;
import static net.jami.jams.server.Server.dataStore;

@WebServlet("/api/auth/devices")
public class DevicesServlet extends HttpServlet {

    /**
     * @apiVersion 1.0.0
     * @api {get} /api/auth/devices Get device info
     * @apiName getDevices
     * @apiGroup Devices
     *
     *
     * @apiSuccess (200) {body} Device device information
     * @apiSuccessExample {json} Success-Response:
     * [{
     *     "certificate":"pem_encoded_certificate",
     *     "displayName":"My Galaxy S8",
     *     "deviceId":"6aec6252ad",
     *     "revoked":true
     * }]
     * @apiError (500) {null} null Device could not be retrieved
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getAttribute("username").toString();
        StatementList statementList = new StatementList();
        statementList.addStatement(new StatementElement("owner","=",username,""));
        List<Device> devices = dataStore.getDeviceDao().getObjects(statementList);
        devices.forEach( device -> {
            device.setRevoked(certificateAuthority.getLatestCRL().get().getRevokedCertificate(device.getCertificate().getSerialNumber()) != null);
        });
        resp.getOutputStream().write(JsonStream.serialize(devices).getBytes());
    }


}
