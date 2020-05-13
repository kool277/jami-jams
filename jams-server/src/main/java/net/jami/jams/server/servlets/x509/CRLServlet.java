package net.jami.jams.server.servlets.x509;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Base64;

import static net.jami.jams.server.Server.certificateAuthority;


@WebServlet("/api/auth/crl")
public class CRLServlet extends HttpServlet {

    private static final String CRL_HEAD = "-----BEGIN X509 CRL-----\n";
    private static final String CRL_TAIL = "\n-----END X509 CRL-----";

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(CRL_HEAD);
        stringBuilder.append(certificateAuthority.getLatestCRLPEMEncoded());
        stringBuilder.append(CRL_TAIL);
        resp.getOutputStream().write(stringBuilder.toString().getBytes());
    }
}
