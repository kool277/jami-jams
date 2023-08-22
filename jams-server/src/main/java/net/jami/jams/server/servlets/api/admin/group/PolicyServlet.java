package net.jami.jams.server.servlets.api.admin.group;

import static net.jami.jams.server.Server.dataStore;

import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;

import net.jami.jams.common.annotations.JsonContent;
import net.jami.jams.common.annotations.ScopedServletMethod;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.Policy;

import java.io.IOException;
import java.util.Scanner;

@Slf4j
@WebServlet("/api/admin/policy")
public class PolicyServlet extends HttpServlet {

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    @JsonContent
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        String name = req.getParameter("name");
        PolicyProfileServlet.getPolicyAndSendResponse(resp, name);
    }

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String name = req.getParameter("name");

        Scanner s = new Scanner(req.getInputStream()).useDelimiter("\\A");
        String policyData = s.hasNext() ? s.next() : "";

        try {
            JsonParser.parseString(policyData);
        } catch (JsonSyntaxException e) {
            resp.sendError(400, "Invalid JSON!");
            return;
        }

        if (dataStore.getPolicyDao().updateObject(name, policyData)) resp.setStatus(200);
        else resp.sendError(500, "could not update the group's name!");
    }

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String name = req.getParameter("name");

        Scanner s = new Scanner(req.getInputStream()).useDelimiter("\\A");
        String policyData = s.hasNext() ? s.next() : "";

        try {
            JsonParser.parseString(policyData);
        } catch (JsonSyntaxException e) {
            resp.sendError(400, "Invalid JSON!");
            return;
        }

        Policy policy = new Policy();
        policy.setName(name);
        policy.setPolicyData(policyData);
        if (dataStore.getPolicyDao().storeObject(policy)) resp.setStatus(200);
        else resp.sendError(500, "Could not create a group successfully!");
    }

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String name = req.getParameter("name");

        if (dataStore.getPolicyDao().deleteObject(name)) {
            resp.setStatus(200);
            return;
        }

        resp.sendError(500, "Could not delete the blueprint successfully!");
    }
}
