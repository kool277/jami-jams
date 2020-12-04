package net.jami.jams.server.servlets.api.admin.group;

import com.google.gson.JsonObject;
import com.jsoniter.output.JsonStream;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.annotations.JsonContent;
import net.jami.jams.common.annotations.ScopedServletMethod;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.UserGroupMapping;
import org.json.JSONObject;

import java.io.IOException;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static net.jami.jams.server.Server.dataStore;

@WebServlet("/api/admin/group/members/*")
@Slf4j
public class UserGroupServlet extends HttpServlet {
    /**
     * @apiVersion 1.0.0
     * @api {get} /api/admin/group/[groupId]/members/ Get JAMS groups members
     * @apiName getGroupMembers
     * @apiGroup Group
     *
     * @apiSuccess (200) {body} Array of usernames
     * @apiSuccessExample {json} Success-Response:
     * {
     *      "usernames": ["user1", "user2", "user3"]
     * }
     * @apiError (404) {null} null could not find members for this groups
     */
    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    @JsonContent
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        String groupId = req.getPathInfo().replace("/","");

        StatementList statementList = new StatementList();
        StatementElement st = new StatementElement("groupId", "=", groupId, "");

        statementList.addStatement(st);

        List<UserGroupMapping> result = dataStore.getUserGroupMappingsDao().getObjects(statementList);

        if (result.isEmpty())
            resp.sendError(404, "No users found for this group!");
        else {
            resp.getOutputStream().write(JsonStream.serialize(result).getBytes());
            resp.setStatus(200);
        }
    }

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    @JsonContent
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        String groupId = req.getPathInfo().replace("/","");

        final JSONObject obj = new JSONObject(req.getReader().lines().collect(Collectors.joining(System.lineSeparator())));

        String username = obj.getString("username");

        StatementList statementList = new StatementList();
        statementList.addStatement(new StatementElement("groupId", "=", groupId, "AND"));
        statementList.addStatement(new StatementElement("username", "=", username, ""));

        if (!dataStore.getUserGroupMappingsDao().getObjects(statementList).isEmpty()) {
            resp.sendError( 409, "The user already part of the group!");
            return;
        }

        UserGroupMapping mapping = new UserGroupMapping();

        mapping.setGroupId(groupId);
        mapping.setUsername(username);

        if (dataStore.getUserGroupMappingsDao().storeObject(mapping)) {
            resp.setStatus(200);
        }
        else
            resp.sendError(500, "Could not add user to group!");

    }

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    @JsonContent
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        String groupId = req.getPathInfo().replace("/","");

        final JSONObject obj = new JSONObject(req.getReader().lines().collect(Collectors.joining(System.lineSeparator())));

        String username = obj.getString("username");


        StatementElement statementElement1 = new StatementElement("username", "=", username, "AND");
        StatementElement statementElement2 = new StatementElement("groupId", "=", groupId, "");

        StatementList constraint = new StatementList();
        constraint.addStatement(statementElement1);
        constraint.addStatement(statementElement2);
        if (dataStore.getUserGroupMappingsDao().deleteObject(constraint)) {
            resp.setStatus(200);
        }
        else {
            resp.sendError(500, "Could not delete mapping between user and group!");
        }
    }
}