package net.jami.jams.server.servlets.api.admin.users;

import com.jsoniter.JsonIterator;
import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.requests.RevocationRequest;
import net.jami.jams.common.objects.requests.RevocationType;
import net.jami.jams.common.objects.responses.DeviceRevocationResponse;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.server.core.workflows.RevokeDeviceFlow;
import net.jami.jams.server.core.workflows.RevokeUserFlow;

import java.io.IOException;
import java.math.BigInteger;

import static net.jami.jams.server.Server.dataStore;

@WebServlet("/api/admin/user")
public class UserServlet extends HttpServlet {

    //Get the user profile.
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        StatementList statementList = new StatementList();
        StatementElement st1 = new StatementElement("username","=",req.getParameter("username"),"");
        statementList.addStatement(st1);
        resp.getOutputStream().write(JsonStream.serialize(dataStore.getUserDao().getObjects(statementList)).getBytes());
    }

    //Create an internal user - this is always technically available, because internal users have the right to exist.
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

    }

    //Update user data.
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

    }

    //Revoke a user.
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        DeviceRevocationResponse devResponse = RevokeUserFlow.revokeUser(req.getParameter("username"));
        if(devResponse != null) resp.getOutputStream().write(JsonStream.serialize(devResponse).getBytes());
        else resp.sendError(500,"An exception has occurred while trying to revoke a device!");
    }
}
