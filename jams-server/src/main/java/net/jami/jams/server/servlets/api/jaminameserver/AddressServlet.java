package net.jami.jams.server.servlets.api.jaminameserver;


import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.jami.AddrLookupResponse;

import java.io.IOException;

import static net.jami.jams.server.Server.nameServer;

@WebServlet("/api/namserver/addr/*")
public class AddressServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String[] path = req.getServletPath().split("/");
        String username = nameServer.getNameFromAddress(path[path.length - 1]);
        if(username == null) resp.sendError(404);
        else resp.getOutputStream().write(JsonStream.serialize(new AddrLookupResponse(username)).getBytes());
    }
}
