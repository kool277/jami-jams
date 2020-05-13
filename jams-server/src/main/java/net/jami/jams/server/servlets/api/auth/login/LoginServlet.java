package net.jami.jams.server.servlets.api.auth.login;

import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.authmodule.AuthTokenResponse;

import java.io.IOException;
import java.security.cert.X509Certificate;

import static net.jami.jams.server.servlets.api.auth.login.AuthRequestProcessor.processUsernamePasswordAuth;
import static net.jami.jams.server.servlets.api.auth.login.AuthRequestProcessor.processX509Auth;

@WebServlet("/api/auth/login")
//This method returns the token which is used for all the next calls to the API.
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //There are 3 possible cases here.
        //Case 1: form submitted username/password
        AuthTokenResponse res = null;
        if(req.getParameter("username") != null && req.getParameter("password") != null){
            res = processUsernamePasswordAuth(req.getParameter("username"),req.getParameter("password"));
        }
        //Case 2: Authorization header.
        if(req.getHeader("authorization") != null){
            res = processUsernamePasswordAuth(req.getHeader("authorization"));
        }
        //Case 3 SSL Certificate
        if(req.getAttribute("jakarta.servlet.request.X509Certificate") != null){
            res = processX509Auth((X509Certificate[])req.getAttribute("jakarta.servlet.request.X509Certificate"));
        }
        //Here we catch the need to create a user (this is only possible in 1 & 2).
        if(res == null) resp.sendError(403,"Invalid credentials!");
        else resp.getOutputStream().write(JsonStream.serialize(res).getBytes());
    }
}
