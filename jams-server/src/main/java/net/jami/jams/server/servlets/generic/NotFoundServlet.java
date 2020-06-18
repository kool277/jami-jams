package net.jami.jams.server.servlets.generic;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

@WebServlet("/404")
@Slf4j
public class NotFoundServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            resp.setStatus(404);
            resp.getOutputStream().write(("{\"error\":\"" + "requested page does not exist" + "\"}").getBytes());
        }
        catch (Exception e){
            log.error("Could not generate an error!");
        }
    }
}
