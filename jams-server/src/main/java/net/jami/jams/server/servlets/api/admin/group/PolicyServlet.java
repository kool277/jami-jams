package net.jami.jams.server.servlets.api.admin.group;

import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.annotations.JsonContent;
import net.jami.jams.common.annotations.ScopedServletMethod;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.Policy;
import org.json.JSONObject;

import java.io.IOException;
import java.util.List;
import java.util.Scanner;

import static net.jami.jams.server.Server.dataStore;

@WebServlet("/api/admin/policy")
public class PolicyServlet extends HttpServlet {


    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    @JsonContent
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {


        List<Policy> policies;
        String name = req.getParameter("name");

        if (!name.equals("*")) {
            StatementList statementList = new StatementList();
            StatementElement st = new StatementElement("name", "=", name, "");
            statementList.addStatement(st);
            resp.getOutputStream().write(JsonStream.serialize(dataStore.getPolicyDao().getObjects(statementList).get(0)).getBytes());
            resp.setStatus(200);
        } else {
            policies = dataStore.getPolicyDao().getObjects(null);
            resp.getOutputStream().write(JsonStream.serialize(policies).getBytes());
            resp.setStatus(200);
        }
    }

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String name = req.getParameter("name");

        Scanner s = new Scanner(req.getInputStream()).useDelimiter("\\A");
        String result = s.hasNext() ? s.next() : "";
        final JSONObject obj = new JSONObject(result);
        final String jsonString = obj.toString();

        StatementList update = new StatementList();
        StatementElement st0 = new StatementElement("name", "=", name, "");
        update.addStatement(st0);
        StatementElement st2 = new StatementElement("policyData", "=", jsonString, "");
        update.addStatement(st2);
        StatementList constraint = new StatementList();
        StatementElement st3 = new StatementElement("name", "=", name, "");
        constraint.addStatement(st3);
        if (dataStore.getPolicyDao().updateObject(update, constraint)) resp.setStatus(200);
        else resp.sendError(500, "could not update the group's name!");
    }

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String name = req.getParameter("name");

        Scanner s = new Scanner(req.getInputStream()).useDelimiter("\\A");
        String result = s.hasNext() ? s.next() : "";

        final JSONObject obj = new JSONObject(result);
        final String jsonString = obj.toString();

        Policy policy = new Policy();
        policy.setName(name);
        policy.setPolicyData(jsonString);
        if (dataStore.getPolicyDao().storeObject(policy)) resp.setStatus(200);
        else resp.sendError(500, "Could not create a group successfully!");
    }

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String name = req.getParameter("name");

        StatementElement statementElement = new StatementElement("name", "=", name, "");
        StatementList constraint = new StatementList();
        constraint.addStatement(statementElement);
        if (dataStore.getPolicyDao().deleteObject(constraint))
            resp.setStatus(200);


        resp.sendError(500, "Could not delete the blueprint successfully!");
    }

}
