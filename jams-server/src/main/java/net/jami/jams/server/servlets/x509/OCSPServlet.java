package net.jami.jams.server.servlets.x509;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

import static net.jami.jams.server.Server.certificateAuthority;

@WebServlet("/api/auth/ocsp")
public class OCSPServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        certificateAuthority.getOCSPResponse(null);
        super.doGet(req, resp);
    }
}
