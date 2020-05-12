package net.jami.jams.server.servlets.api.install;

import com.jsoniter.JsonIterator;
import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.objects.requests.CreateAuthSourceRequest;

import java.io.IOException;

import static net.jami.jams.server.Server.userAuthenticationModule;

@WebServlet("/api/install/auth")
public class CreateAuthSourceServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doGet(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        CreateAuthSourceRequest authSourceRequest = JsonIterator.deserialize(
                req.getInputStream().readAllBytes(),CreateAuthSourceRequest.class);
        CachedObjects.localAuthSettings = null;
        CachedObjects.activeDirectorySettings = null;
        CachedObjects.ldapSettings = null;
        boolean error = false;
        switch (authSourceRequest.getType()){
            case LOCAL:
                CachedObjects.localAuthSettings = authSourceRequest.getLocalAuthSettings();
                break;
            case LDAP:
                if(userAuthenticationModule.testModuleConfiguration(AuthenticationSourceType.LDAP,
                        JsonStream.serialize(authSourceRequest.getLdapSettings()))){
                    CachedObjects.ldapSettings = authSourceRequest.getLdapSettings();
                }
                else error = true;
                break;
            case AD:
                if(userAuthenticationModule.testModuleConfiguration(AuthenticationSourceType.AD,
                        JsonStream.serialize(authSourceRequest.getActiveDirectorySettings()))) {
                    CachedObjects.activeDirectorySettings = authSourceRequest.getActiveDirectorySettings();
                }
                else error = true;
                break;
        }
        if(error) resp.sendError(500,"The supplied configuration is invalid or the connectivity tests has failed");
        else CachedObjects.endpoint = "/api/install/settings";
    }
}
