package net.jami.jams.server.servlets.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.server.Server;
import net.jami.jams.server.servlets.filters.WebAppFilter;

import java.io.IOException;

@WebServlet("/web/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if(Server.isInstalled.get()) req.getRequestDispatcher("/login.jsp").forward(req,resp);
        else req.getRequestDispatcher("/register.jsp").forward(req,resp);
    }
}
