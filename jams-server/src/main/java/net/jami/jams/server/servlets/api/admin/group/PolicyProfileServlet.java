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
import net.jami.jams.common.objects.user.Policy;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@WebServlet("/api/admin/policy/*")
@Slf4j
public class PolicyProfileServlet extends HttpServlet {

    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    @JsonContent
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        String name = req.getPathInfo().replace("/", "");
        getPolicyAndSendResponse(resp, name);
    }

    public static void getPolicyAndSendResponse(HttpServletResponse resp, String name)
            throws IOException {
        if (name.equals("*")) {
            List<Policy> policies = dataStore.getPolicyDao().getAll();
            resp.getOutputStream().write(JsonStream.serialize(policies).getBytes());
            resp.setStatus(200);
            return;
        }

        Optional<Policy> policy = dataStore.getPolicyDao().getByName(name);
        if (policy.isPresent()) {
            byte[] bytes = JsonStream.serialize(policy.orElseThrow()).getBytes();
            resp.getOutputStream().write(bytes);
            resp.setStatus(200);
        } else {
            resp.sendError(404, "{\"message\": \"No policy found.\"}");
        }
    }
}
