package net.jami.jams.server.servlets.api.admin.group;

import com.google.gson.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.annotations.JsonContent;
import net.jami.jams.common.annotations.ScopedServletMethod;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.Group;

import java.io.IOException;
import java.util.ArrayList;
import java.util.UUID;

import static net.jami.jams.server.Server.dataStore;

@WebServlet("/api/admin/group")
@Slf4j
public class AddGroupServlet extends HttpServlet {

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    @JsonContent
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Group group = new Group();
        UUID uuid = UUID.randomUUID();
        group.setId(uuid.toString());
        group.setName(req.getParameter("name"));
        group.setBlueprint(req.getParameter("blueprintName"));
        if (dataStore.getGroupDao().storeObject(group)) {
            JsonObject data = new JsonObject();
            data.addProperty("id", uuid.toString());
            resp.getOutputStream().write(data.toString().getBytes());
            resp.setStatus(200);
        }
        else
            resp.sendError(500, "Could not create a group successfully!");
    }
}