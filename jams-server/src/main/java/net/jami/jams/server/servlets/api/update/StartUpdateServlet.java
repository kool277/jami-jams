package net.jami.jams.server.servlets.api.update;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.ca.JamsCA;
import net.jami.jams.server.Server;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/startupdate")
@Slf4j
public class StartUpdateServlet extends HttpServlet {


    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", JamsCA.serverDomain);
        resp.setContentType("application/json");
    }
}
