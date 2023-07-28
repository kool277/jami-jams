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
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.Group;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/admin/groups")
@Slf4j
public class GroupsServlet extends HttpServlet {

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    @JsonContent
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        List<Group> groups = dataStore.getGroupDao().getAll();

        if (!groups.isEmpty()) {
            resp.getOutputStream().write(JsonStream.serialize(groups).getBytes());
            resp.setStatus(200);
        } else {
            resp.setStatus(404);
        }
    }
}
