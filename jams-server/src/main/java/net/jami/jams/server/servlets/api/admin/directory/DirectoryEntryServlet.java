package net.jami.jams.server.servlets.api.admin.directory;

import com.jsoniter.JsonIterator;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.authmodule.AuthModuleKey;
import net.jami.jams.common.objects.user.UserProfile;

import java.io.IOException;

import static net.jami.jams.server.Server.userAuthenticationModule;

@WebServlet("/api/admin/directory/entry")
@Slf4j
public class DirectoryEntryServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //Create a user profile.
        try {
            String realm = req.getParameter("directory");
            UserProfile userProfile = JsonIterator.deserialize(req.getInputStream().readAllBytes(), UserProfile.class);
            userAuthenticationModule.getAuthSources().get(new AuthModuleKey(realm, AuthenticationSourceType.LOCAL))
                    .setUserProfile(userProfile);
            resp.setStatus(200);
        }
        catch (Exception e){
            log.error("Could not store a user profile with error {}",e.getMessage());
            resp.sendError(500,e.getMessage());
        }

    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //Update a user's profile.
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //This method will probably never be implemented.
    }
}
