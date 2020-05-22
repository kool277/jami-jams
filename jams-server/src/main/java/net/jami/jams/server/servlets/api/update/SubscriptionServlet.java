package net.jami.jams.server.servlets.api.update;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/api/subscription")
public class SubscriptionServlet extends HttpServlet {

    //Get the subscription status (see: SubscriptionStatusResponse.class)
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doGet(req, resp);
    }

    //Upload the license here, which is really just uploading a base64 representation of the keypair - and store it
    //somewhere.
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //Create the keystore based on the uploadaded keypair.


        super.doPost(req, resp);
    }
}
