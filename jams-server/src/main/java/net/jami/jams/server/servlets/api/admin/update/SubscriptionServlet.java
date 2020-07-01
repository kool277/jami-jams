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
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.ca.JamsCA;
import net.jami.jams.common.annotations.ScopedServletMethod;
import net.jami.jams.common.objects.responses.SubscriptionStatusResponse;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.server.Server;

import java.io.IOException;

@WebServlet("/api/admin/subscription")
public class SubscriptionServlet extends HttpServlet {

    //Get the subscription status (see: SubscriptionStatusResponse.class)
    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setHeader("Access-Control-Allow-Origin", JamsCA.serverDomain);
        resp.setContentType("application/json");
        SubscriptionStatusResponse subscriptionStatusResponse = new SubscriptionStatusResponse();
        subscriptionStatusResponse.setLicenseInformation(Server.licenseService.getLicenseInformation());
        subscriptionStatusResponse.setActivated(Server.activated.get());
        resp.getOutputStream().write(JsonStream.serialize(subscriptionStatusResponse).getBytes());
    }

    //Upload the license here, which is really just uploading a base64 representation of the keypair - and store it
    // on disk..
    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.getInputStream().readAllBytes();

    }
}
