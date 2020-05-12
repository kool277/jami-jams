package net.jami.jams.server.servlets.api.install;

import com.jsoniter.JsonIterator;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.cryptoengineapi.CertificateAuthorityConfig;
import net.jami.jams.server.core.workflows.InstallationFinalizer;

import java.io.IOException;

@WebServlet("/api/install/settings")
public class CreateServerSettingsServlet extends HttpServlet {

    InstallationFinalizer finalizer = new InstallationFinalizer();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doGet(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        CertificateAuthorityConfig config = JsonIterator.deserialize(
                req.getInputStream().readAllBytes(),CertificateAuthorityConfig.class);
        CachedObjects.certificateAuthorityConfig = config;
        if(!finalizer.finalizeInstallation()) {
            resp.sendError(500, "Could not store settings, a problem occured with finishing the installation");
            return;
        }
        resp.sendRedirect("/");
    }
}
