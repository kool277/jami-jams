package net.jami.jams.server.servlets.api.update;

import com.jsoniter.output.JsonStream;
import net.jami.jams.ca.JamsCA;
import net.jami.jams.server.Server;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.logging.Logger;

@WebServlet("/api/checkupdate")
public class NeedsUpdateServlet extends HttpServlet {

    private final static Logger logger = Logger.getLogger(NeedsUpdateServlet.class.getName());

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", JamsCA.serverDomain);
        resp.setContentType("application/json");
        try {
            HashMap<String,Object> payload = new HashMap<>();
            if(!Server.updateInterface.getVersions().equals("{}")) {
                payload.put("updateAvailable", Server.updateInterface.getUpdateAvailable().get());
                payload.put("newVersions", Server.updateInterface.getVersions());
            }
            else
                payload.put("updateAvailable",false);

            resp.getOutputStream().write(JsonStream.serialize(payload).getBytes());
            resp.setStatus(200);
        }
        catch (Exception e){
            resp.setStatus(500);
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

    }
}
