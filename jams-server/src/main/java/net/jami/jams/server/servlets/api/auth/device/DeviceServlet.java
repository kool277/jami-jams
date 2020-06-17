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
import net.jami.jams.common.annotations.ScopedServletMethod;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.devices.Device;
import net.jami.jams.common.objects.requests.DeviceRegistrationRequest;
import net.jami.jams.common.objects.responses.DeviceRegistrationResponse;
import net.jami.jams.common.objects.responses.DeviceRevocationResponse;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.server.core.workflows.RegisterDeviceFlow;
import net.jami.jams.server.core.workflows.RevokeDeviceFlow;

import java.io.IOException;

import static net.jami.jams.server.Server.certificateAuthority;
import static net.jami.jams.server.Server.dataStore;

@WebServlet("/api/auth/device/*")
public class DeviceServlet extends HttpServlet {

    /**
     * @apiVersion 1.0.0
     * @api {get} /api/auth/device Get device info
     * @apiName getDevice
     * @apiGroup Device
     *
     * @apiParam {path} deviceId id of the device
     *
     * @apiSuccess (200) {body} Device device information
     * @apiSuccessExample {json} Success-Response:
     * {
     *     "certificate":"pem_encoded_certificate",
     *     "displayName":"My Galaxy S8",
     *     "deviceId":"6aec6252ad",
     *     "revoked":true
     * }
     * @apiError (500) {null} null Device could not be retrieved
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getAttribute("username").toString();
        String deviceId = req.getPathInfo().replace("/","");
        StatementList statementList = new StatementList();
        StatementElement st1 = new StatementElement("owner","=",username,"AND");
        StatementElement st2 = new StatementElement("deviceId","=",deviceId,"");
        statementList.addStatement(st1);
        statementList.addStatement(st2);
        Device device = dataStore.getDeviceDao().getObjects(statementList).get(0);
        device.setRevoked(certificateAuthority.getLatestCRL().get().getRevokedCertificate(device.getCertificate().getSerialNumber()) != null);
        resp.getOutputStream().write(JsonStream.serialize(device).getBytes());
    }

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/auth/device Enroll a device
     * @apiName postDevice
     * @apiGroup Device
     *
     * @apiParam {body} DeviceRegistrationRequest device registration request
     * @apiParamExample {json} Request-Example:
     * {
     *     "csr":"pem_encoded_csr",
     *     "deviceName":"My Galaxy S8"
     * }
     *
     * @apiSuccess (200) {body} DeviceRegistrationResponse registration response
     * @apiError (500) {null} null Device could not be enrolled
     * @apiSuccessExample {json} Success-Response:
     * {
     *     "certificateChain":"pem_encoded_certificate_chain"
     *     "displayName":"John Doe"
     *     "nameServer":"https://mydomain.com"
     *     "deviceReceipt": "device_receipt_object"
     *     "receiptSignature":"receipt_signature_object"
     *     "userPhoto":"base64_encoded_photo"
     * }
     */
    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.USER})
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        DeviceRegistrationRequest request = JsonIterator.deserialize(req.getInputStream().readAllBytes(), DeviceRegistrationRequest.class);
        DeviceRegistrationResponse devResponse = RegisterDeviceFlow.registerDevice(req.getAttribute("username").toString(),request);
        if(devResponse != null) resp.getOutputStream().write(JsonStream.serialize(devResponse).getBytes());
        else resp.sendError(500,"An exception has occurred while trying to enroll a device!");
    }

    /**
     * @apiVersion 1.0.0
     * @api {put} /api/auth/device Change the name of a device
     * @apiName putDevice
     * @apiGroup Device
     *
     * @apiParam {path} deviceId id of the device
     * @apiParam {query} deviceName new name for the device
     *
     * @apiSuccess (200) {null} null name changed successfully
     * @apiError (500) {null} null device name could not be changed
     */
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

    /**
     * @apiVersion 1.0.0
     * @api {delete} /api/auth/device Deactivate a device
     * @apiName deleteDevice
     * @apiGroup Device
     *
     * @apiParam {path} deviceId id of the device
     *
     * @apiSuccess (200) {null} null device successfully deactivated
     * @apiError (500) {null} null device could not be deactivated
     */
    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.USER})
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doDelete(req,resp);
        String deviceId = req.getPathInfo().replace("/","");
        DeviceRevocationResponse devResponse = RevokeDeviceFlow.revokeDevice(req.getAttribute("username").toString(),deviceId);
        if(devResponse != null) resp.getOutputStream().write(JsonStream.serialize(devResponse).getBytes());
        else resp.sendError(500,"An exception has occurred while trying to revoke a device!");
    }
}
