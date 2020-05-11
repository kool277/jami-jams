package net.jami.jams.server.servlets.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.server.Server;
import net.jami.jams.server.servlets.filters.WebAppFilter;

import java.io.IOException;

@WebServlet("/web/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if(WebAppFilter.authenticatedUsers.containsKey(req.getSession())){
            resp.sendRedirect("/index");
            return;
        }
        req.setAttribute("installed",Server.isInstalled.get());
        req.getRequestDispatcher("/pages/login.jsp").forward(req,resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //Similar technique as the one for API calls, simply handle this here because this is a different logic.
        if(!Server.isInstalled.get()){
            //Basically create the admin user here.
            User user = new User();
            user.setUserType(AuthenticationSourceType.LOCAL);
            user.setAccessLevel(AccessLevel.ADMIN);
            user.setPassword(req.getParameter("password"));
            user.setUsername(req.getParameter("username"));
            Server.dataStore.createUser(user);
            resp.sendRedirect("/web/install/auth");
            return;
        }
        if(Server.userAuthenticationModule.authenticateUser
                (req.getParameter("username"),req.getParameter("password"))
        ){
            StatementList statementList = new StatementList();
            statementList.addStatement(new StatementElement("username","=",req.getParameter("username"),""));
            User user = Server.dataStore.getUserDao().getObjects(statementList).get(0);
            WebAppFilter.authenticatedUsers.put(req.getSession(),user);
            req.setAttribute("accessLevel",user.getAccessLevel());
            if(user.getNeedsPasswordReset()) resp.sendRedirect("/web/changePassword");
            else resp.sendRedirect("/web/index");
        }
        else{
            resp.sendRedirect("/web/login");
        }
    }
}
