package net.jami.jams.server.servlets.api.admin.group;

import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.annotations.ScopedServletMethod;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.user.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static net.jami.jams.server.Server.dataStore;

@WebServlet("/api/admin/policy")
public class PolicyServlet extends HttpServlet {


    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        StatementList statementList = new StatementList();
        StatementElement st1 = new StatementElement("groupName","=",req.getParameter("groupName"),"");
        statementList.addStatement(st1);
        Policy policy = dataStore.getPolicyDao().getObjects(statementList).get(0);
        resp.getOutputStream().write(JsonStream.serialize(policy).getBytes());
    }

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        StatementList update = new StatementList();
        StatementElement st0 = new StatementElement("groupName", "=", req.getParameter("groupName"), "");
        update.addStatement(st0);
        StatementElement st1 = new StatementElement("username", "=", req.getParameter("username"), "");
        update.addStatement(st1);
        StatementElement st2 = new StatementElement("policyData", "=", req.getParameter("policyData"), "");
        update.addStatement(st2);
        StatementList constraint = new StatementList();
        StatementElement st3 = new StatementElement("groupName", "=", req.getParameter("groupName"), "");
        constraint.addStatement(st3);
        if (dataStore.getPolicyDao().updateObject(update, constraint)) resp.setStatus(200);
        else resp.sendError(500, "could not update the group's name!");
    }

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Policy policy = new Policy();
        policy.setGroupName(req.getParameter("groupName"));
        policy.setUsername(req.getParameter("username"));
        policy.setPolicyData(req.getParameter("policyData"));
        if (dataStore.getPolicyDao().storeObject(policy)) resp.setStatus(200);
        else resp.sendError(500, "Could not create a group successfully!");
    }

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        StatementElement statementElement = new StatementElement("groupName", "=", req.getParameter("groupName"), "");
        StatementList constraint = new StatementList();
        constraint.addStatement(statementElement);
        if (dataStore.getPolicyDao().deleteObject(constraint))
            resp.setStatus(200);


        resp.sendError(500, "Could not delete the blueprint successfully!");
    }

}
