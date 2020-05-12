package net.jami.jams.server.servlets.api.install;

import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.authmodule.AuthenticationResult;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.User;

import java.io.IOException;

import static net.jami.jams.server.Server.dataStore;
import static net.jami.jams.server.servlets.api.auth.login.AuthRequestProcessor.processUsernamePasswordAuth;

@WebServlet("/api/install/start")
public class StartInstallServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //Here we must decide which page to show - login or sign-up
        StatementList statementList = new StatementList();
        statementList.setStatements(null);
        if(dataStore.getUserDao().getObjects(statementList).size() != 0) resp.setHeader("showLogin","true");
        else resp.setHeader("showLogin","false");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        AuthenticationResult res = null;
        if(req.getParameter("username") != null && req.getParameter("password") != null){
            res = processUsernamePasswordAuth(req.getParameter("username"),req.getParameter("password"));
        }
        resp.getOutputStream().write(JsonStream.serialize(res).getBytes());
    }

    //This is the ONLY case where we write directy to the DB
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        StatementList statementList = new StatementList();
        statementList.setStatements(null);
        if(dataStore.getUserDao().getObjects(statementList).size() != 0){
            resp.sendError(500,"We have tried to create an administrative account where one already exists!");
            return;
        }
        //The admin user has no X509 properties.
        User user = new User();
        user.setUsername(req.getParameter("username"));
        user.setPassword(req.getParameter("password"));
        user.setUserType(AuthenticationSourceType.LOCAL);
        user.setRealm("LOCAL");
        user.setAccessLevel(AccessLevel.ADMIN);
        dataStore.getUserDao().storeObject(user);
        AuthenticationResult res = processUsernamePasswordAuth(user.getUsername(),user.getPassword());
        resp.getOutputStream().write(JsonStream.serialize(res).getBytes());
    }
}
