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
import net.jami.jams.common.objects.user.Policy;

import java.io.IOException;
import java.util.List;

import static net.jami.jams.server.Server.dataStore;

@WebServlet("/api/admin/policy/*")
@Slf4j
public class PolicyProfileServlet extends HttpServlet {


    @Override
    @ScopedServletMethod(securityGroups = {AccessLevel.ADMIN})
    @JsonContent
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        List<Policy> policies;
        String name = req.getPathInfo().replace("/","");

        if (!name.equals("*")) {
            StatementList statementList = new StatementList();
            StatementElement st = new StatementElement("name", "=", name, "");
            statementList.addStatement(st);
            if (!dataStore.getPolicyDao().getObjects(statementList).isEmpty()) {
                resp.getOutputStream().write(JsonStream.serialize(dataStore.getPolicyDao().getObjects(statementList).get(0)).getBytes());
                resp.setStatus(200);
            }
        } else {
            policies = dataStore.getPolicyDao().getObjects(null);
            resp.getOutputStream().write(JsonStream.serialize(policies).getBytes());
            resp.setStatus(200);
        }
    }
}
