package net.jami.jams.server.servlets.api.update;

import net.jami.jams.ca.JamsCA;
import net.jami.jams.server.Server;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.logging.Logger;

@WebServlet("/api/startupdate")
public class StartUpdateServlet extends HttpServlet {

    private final static Logger logger = Logger.getLogger(StartUpdateServlet.class.getName());

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", JamsCA.serverDomain);
        resp.setContentType("application/json");
        try {
            Server.updateInterface.approveUpdate();
            resp.setStatus(200);
        }
        catch (Exception e){
            resp.setStatus(500);
        }
    }
}
