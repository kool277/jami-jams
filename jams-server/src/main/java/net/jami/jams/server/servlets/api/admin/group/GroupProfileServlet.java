package net.jami.jams.server.servlets.api.admin.group;

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
import net.jami.jams.common.objects.user.UserProfile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static net.jami.jams.server.Server.dataStore;

@WebServlet("/api/admin/group/*")
@Slf4j
public class GroupProfileServlet extends HttpServlet {


    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    @JsonContent
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        List<Group> groups = new ArrayList<>();
        Group singleGroup = null;
        String groupName = req.getPathInfo().replace("/","");

        if (!groupName.equals("*")) {
            StatementList statementList = new StatementList();
            StatementElement st = new StatementElement("name", "=", groupName, "");

            statementList.addStatement(st);
            if (!dataStore.getGroupDao().getObjects(statementList).isEmpty())
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
}
