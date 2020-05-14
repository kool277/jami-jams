package net.jami.jams.server.servlets.api.auth.directory;

import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.objects.user.UserProfile;
import net.jami.jams.server.Server;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static net.jami.jams.server.Server.userAuthenticationModule;

@WebServlet("/api/auth/directory/search")
public class SearchDirectoryServlet extends HttpServlet {

    //The search directory function does not automatically create users, this would be costly at this point
    //right now, we will implement it when Jami supports lists of users. this is a work in progress as it
    //requires changes on the name server as well.
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<UserProfile> userProfiles = new ArrayList<>();
        userAuthenticationModule.getAuthSources().forEach( (k,v) ->{
                UserProfile[] profiles = v.getUserProfile(req.getParameter("queryString"),"FULL_TEXT_NAME");
                if(profiles != null && profiles.length != 0) userProfiles.addAll(Arrays.asList(profiles));
        });
        resp.getOutputStream().write(JsonStream.serialize(userProfiles).getBytes());
    }
}
