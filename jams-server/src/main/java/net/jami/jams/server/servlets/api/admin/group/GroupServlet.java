package net.jami.jams.server.servlets.api.admin.group;

import static net.jami.jams.server.Server.dataStore;

import com.jsoniter.output.JsonStream;

import jakarta.servlet.ServletException;
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
import net.jami.jams.common.objects.user.Group;

import org.json.JSONObject;

import java.io.IOException;
import java.util.stream.Collectors;

@WebServlet("/api/admin/group/*")
@Slf4j
public class GroupServlet extends HttpServlet {

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    @JsonContent
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        Group singleGroup = null;
        String id = req.getPathInfo().replace("/", "");

        StatementList statementList = new StatementList();
        StatementElement st = new StatementElement("id", "=", id, "");

        statementList.addStatement(st);
        if (!dataStore.getGroupDao().getObjects(statementList).isEmpty())
            singleGroup = dataStore.getGroupDao().getObjects(statementList).get(0);

        if (singleGroup != null) {
            resp.getOutputStream().write(JsonStream.serialize(singleGroup).getBytes());
            resp.setStatus(200);
        } else {
            log.info("No group with this id was found!");
            resp.setStatus(404);
        }
    }

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    @JsonContent
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        String id = req.getPathInfo().replace("/", "");

        final JSONObject obj =
                new JSONObject(
                        req.getReader()
                                .lines()
                                .collect(Collectors.joining(System.lineSeparator())));

        String name = obj.getString("name");
        String blueprint = obj.getString("blueprint");

        StatementList update = new StatementList();

        StatementElement st0 = new StatementElement("id", "=", id, "");
        update.addStatement(st0);

        StatementElement st1 = new StatementElement("name", "=", name, "");
        update.addStatement(st1);

        StatementElement st2 = new StatementElement("blueprint", "=", blueprint, "");
        update.addStatement(st2);

        StatementList constraint = new StatementList();

        if (dataStore.getGroupDao().updateObject(update, constraint)) resp.setStatus(200);
        else resp.sendError(500, "Could not update group!");
    }

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    @JsonContent
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String id = req.getPathInfo().replace("/", "");

        StatementElement statementElement = new StatementElement("id", "=", id, "");

        StatementList constraint = new StatementList();
        constraint.addStatement(statementElement);
        if (dataStore.getGroupDao().deleteObject(constraint)) {
            StatementElement statementElement1 = new StatementElement("username", "=", "*", "");
            StatementElement statementElement2 = new StatementElement("groupId", "=", id, "");
            StatementList constraintMapping = new StatementList();
            constraintMapping.addStatement(statementElement1);
            constraintMapping.addStatement(statementElement2);
            if (dataStore.getUserGroupMappingsDao().deleteObject(constraintMapping))
                resp.setStatus(200);
            else resp.sendError(500, "Could not delete the group mappings successfully!");
        } else {
            resp.sendError(500, "Could not delete the group successfully!");
        }
    }
}
