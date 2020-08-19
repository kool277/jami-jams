package net.jami.jams.server.servlets.api.admin.group;

import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.annotations.ScopedServletMethod;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.user.*;
import net.jami.jams.common.serialization.tomcat.TomcatCustomErrorHandler;
import net.jami.jams.server.core.workflows.AddUserToGroupFlow;
import net.jami.jams.server.core.workflows.RegisterDeviceFlow;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static net.jami.jams.server.Server.dataStore;

@WebServlet("/api/admin/group")
@Slf4j
public class GroupServlet extends HttpServlet {

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        List<Group> groups = new ArrayList<>();
        Group singleGroup = null;

        if (!req.getParameter("groupName").equals("*")) {
            StatementList statementList = new StatementList();
            StatementElement st = new StatementElement("name", "=", req.getParameter("groupName"), "");

            statementList.addStatement(st);
            singleGroup = dataStore.getGroupDao().getObjects(statementList).get(0);
        } else {
            groups = dataStore.getGroupDao().getObjects(null);
        }

        if (singleGroup != null) {
            Group finalSingleGroup = singleGroup;
            List<UserProfile> profiles = dataStore.getUserProfileDao().getObjects(null).stream().filter(profile ->
                    profile.getGroupMemberships().contains(finalSingleGroup.getName())).collect(Collectors.toList());

            profiles.forEach(profile ->
                    finalSingleGroup.getGroupMembers().add(profile.getUsername()));

            resp.getOutputStream().write(JsonStream.serialize(finalSingleGroup).getBytes());
            resp.setStatus(200);
        }
        if (!groups.isEmpty()) {
            List<UserProfile> profiles = dataStore.getUserProfileDao().getObjects(null);
            for (Group group: groups) {
                for (UserProfile p: profiles) {
                    if (p.getGroupMemberships().contains(group.getName()))
                        group.getGroupMembers().add(p.getUsername());
                }
            }

            resp.getOutputStream().write(JsonStream.serialize(groups).getBytes());
            resp.setStatus(200);
        }
        else {
            log.info("No existing groups were found.");
            resp.setStatus(200);
        }
    }

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String name = req.getParameter("newName");
        StatementList statementList = new StatementList();
        StatementElement st = new StatementElement("name", "=", name, "");

        statementList.addStatement(st);
        Group targetGroup = dataStore.getGroupDao().getObjects(statementList).get(0);
        List<UserProfile> profiles = dataStore.getUserProfileDao().getObjects(null).stream().filter(profile ->
                profile.getGroupMemberships().contains(targetGroup.getName())).collect(Collectors.toList());

        profiles.forEach(profile ->
                targetGroup.getGroupMembers().add(profile.getUsername()));

        // if the username sent isn't already part of the group members, then we add it
        if (!targetGroup.getGroupMembers().contains(req.getParameter("groupMembers")))
            AddUserToGroupFlow.addUserToGroup(name, req.getParameter("groupMembers"));
        // otherwise remove the group from the user's memberships.
        else {
            statementList = new StatementList();
            st = new StatementElement("username", "=", req.getParameter("groupMembers"), "");
            statementList.addStatement(st);

            UserProfile targetProfile = dataStore.getUserProfileDao().getObjects(statementList).get(0);
            UserGroupMapping mapping = dataStore.getUserGroupMappingsDao().getObjects(statementList).get(0);
            mapping.removeGroup(name);

            StatementList update = new StatementList();
            StatementElement st0 = new StatementElement("groups", "=", mapping.getGroups(), "");
            update.addStatement(st0);
            StatementList constraint = new StatementList();
            StatementElement st1 = new StatementElement("username", "=", mapping.getUsername(), "");
            constraint.addStatement(st1);

            // update user mappings
            dataStore.getUserGroupMappingsDao().updateObject(update, constraint);

            List<String> groups = targetProfile.getGroupMemberships();
            groups.remove(name);
            // TODO: LDAP/AD handling
            dataStore.updateUserProfile(targetProfile);
        }

        StatementList update = new StatementList();
        StatementElement st0 = new StatementElement("name", "=", name, "");
        update.addStatement(st0);
        StatementList constraint = new StatementList();
        StatementElement st1 = new StatementElement("name", "=", name, "");
        constraint.addStatement(st1);
        if (dataStore.getGroupDao().updateObject(update, constraint)) resp.setStatus(200);
        else resp.sendError(500, "could not update the group's name!");
    }

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Group group = new Group();
        group.setName(req.getParameter("name"));
        group.setGroupMembers(new ArrayList<String>());
        if (dataStore.getGroupDao().storeObject(group))
            resp.setStatus(200);
        else
            resp.sendError(500, "Could not create a group successfully!");
    }

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        StatementElement statementElement = new StatementElement("groupName", "=", req.getParameter("groupName"), "");
        StatementList constraint = new StatementList();
        constraint.addStatement(statementElement);
        if (dataStore.getGroupDao().deleteObject(constraint)) {
            // if deletion was successful, cascade the deletion onto the users
            List<UserProfile> validProfiles = dataStore.getUserProfileDao().getObjects(null).stream().filter(profile ->
                    profile.getGroupMemberships().remove(Long.parseLong(req.getParameter("groupName")))).collect(Collectors.toList());

            validProfiles.forEach(profile ->
                    dataStore.updateUserProfile(profile));

            resp.setStatus(200);
        }
        else {
            resp.sendError(500, "Could not delete the group successfully!");
        }
    }
}
