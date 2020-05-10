package net.jami.jams.server.servlets.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.server.Server;

import java.io.IOException;

@Slf4j
@WebServlet("/web/index")
public class IndexServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setAttribute("test","AB");
        if(Server.isInstalled.get()) req.getRequestDispatcher("login.jsp").forward(req,resp);
        else req.getRequestDispatcher("register.jsp").forward(req,resp);
    }

}
