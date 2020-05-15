package net.jami.jams.server.servlets.api.auth.directory;

import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.authmodule.AuthModuleKey;
import net.jami.jams.common.objects.user.UserProfile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static net.jami.jams.server.Server.userAuthenticationModule;

//This is an endpoint to manipulate directory entry-data, this make sense only for local setups.

@WebServlet("/api/auth/directory/entry")
public class DirectoryEntryServlet extends HttpServlet {

    //Get a profile from a directory, we are assuming here
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getParameter("directory") != null && req.getParameter("directoryType") != null) {
            UserProfile[] profiles = userAuthenticationModule.getAuthSources()
                    .get(new AuthModuleKey(req.getParameter("directory"), AuthenticationSourceType.fromString(req.getParameter("directoryType"))))
                    .getUserProfile(req.getParameter("username"), "LOGON_NAME");
            resp.getOutputStream().write(JsonStream.serialize(profiles[0]).getBytes());
            return;
        }
        List<UserProfile> userProfiles = new ArrayList<>();
        userAuthenticationModule.getAuthSources().forEach((k, v) -> {
            UserProfile[] profiles = v.getUserProfile(req.getParameter("username"), "LOGON_NAME");
            if (profiles != null && profiles.length != 0) userProfiles.addAll(Arrays.asList(profiles));
        });
        resp.getOutputStream().write(JsonStream.serialize(userProfiles.get(0)).getBytes());
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //This should work to modify a profile only in the case of a LOCAL directory.
    }
}
