package net.jami.jams.server.servlets.api.admin.update;

import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.ca.JamsCA;
import net.jami.jams.common.objects.responses.SubscriptionStatusResponse;
import net.jami.jams.server.Server;

import java.io.IOException;

@WebServlet("/api/subscription")
public class SubscriptionServlet extends HttpServlet {

    //Get the subscription status (see: SubscriptionStatusResponse.class)
    @Override
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
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.getInputStream().readAllBytes();

    }
}
