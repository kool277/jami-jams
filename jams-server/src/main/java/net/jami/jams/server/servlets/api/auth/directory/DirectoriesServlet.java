package net.jami.jams.server.servlets.api.auth.directory;

import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

import static net.jami.jams.server.Server.userAuthenticationModule;

@WebServlet("/api/auth/directories")
public class DirectoriesServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.getOutputStream().write(JsonStream.serialize(userAuthenticationModule.getAuthSources().keySet()).getBytes());
    }
}
