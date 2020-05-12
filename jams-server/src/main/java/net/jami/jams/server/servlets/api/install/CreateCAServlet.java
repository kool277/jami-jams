package net.jami.jams.server.servlets.api.install;

import com.jsoniter.JsonIterator;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.objects.requests.CreateCARequest;
import net.jami.jams.common.utils.Validator;

import java.io.IOException;

@WebServlet("/api/install/ca")
public class CreateCAServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doGet(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        CreateCARequest caRequest = JsonIterator.deserialize(req.getInputStream().readAllBytes(),CreateCARequest.class);
        if(!Validator.validateCARequests(caRequest)){
            resp.sendError(500,"Certificate was either not a CA or the private key did not match the certificate");
        }
        else{
            CachedObjects.createCARequest = caRequest;
            CachedObjects.endpoint = "/api/install/auth";
        }
    }
}
