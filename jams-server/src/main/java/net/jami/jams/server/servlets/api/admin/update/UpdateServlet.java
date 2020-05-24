package net.jami.jams.server.servlets.api.admin.update;

import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.updater.FullSystemStatusResponse;

import java.io.IOException;

import static net.jami.jams.server.Server.appUpdater;

@WebServlet("/api/update")
public class UpdateServlet extends HttpServlet {

    //Return the current version number and the available version number.
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        FullSystemStatusResponse response = new FullSystemStatusResponse();
        response.setLocalVersions(appUpdater.getLocalVersions());
        response.setRemoteVersions(appUpdater.getRemoteVersions());
        response.setUpdateAvailable(appUpdater.getUpdateAvailable());
        resp.getOutputStream().write(JsonStream.serialize(response).getBytes());
    }

    //This is the do-update button.
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if(appUpdater.getUpdateAvailable()){
            appUpdater.doUpdate();
        }
    }
}
