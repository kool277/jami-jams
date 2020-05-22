package net.jami.jams.server.servlets.api.user;

import com.jsoniter.JsonIterator;
import com.jsoniter.any.Any;
import com.jsoniter.output.JsonStream;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.ca.JamsCA;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.server.Server;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;

@WebServlet("/api/user/exists")
@Slf4j
public class LocalUserExistsServlet extends HttpServlet {


    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", JamsCA.serverDomain);
        resp.setContentType("application/json");
        StringBuilder stringBuilder = new StringBuilder();

        try {
            int x = 0;
            while (true) {
                x = req.getInputStream().read();
                if(x == -1) break;
                stringBuilder.append((char) x);
            }
        }
        catch (Exception e) {
            log.error("error decoding request body");
        }


        if(stringBuilder.toString() != null) {

            Any userData = JsonIterator.deserialize(stringBuilder.toString());
            String username = userData.get("username").toString();
            try {
                    if (Server.dataStore.userExists(username)) {

                        StatementList statementList = new StatementList();
                        StatementElement statementElement = new StatementElement("username", "=", username, "");
                        statementList.addStatement(statementElement);
                        User user = Server.dataStore.getUserDao().getObjects(statementList).get(0);

                        if (user != null && user.getUserType() == AuthenticationSourceType.LOCAL) {
                            resp.setStatus(200);
                            HashMap<String, String> statusInfo = new HashMap<>();
                            statusInfo.put("exists", "true");
                            resp.getOutputStream().write(JsonStream.serialize(statusInfo).getBytes());
                        } else {
                            resp.setStatus(500);
                            HashMap<String, String> statusInfo = new HashMap<>();
                            statusInfo.put("exists", "false");
                            resp.getOutputStream().write(JsonStream.serialize(statusInfo).getBytes());
                        }
                    }

            } catch (Exception e) {
                log.info(e.toString());
                resp.setStatus(500);
            }
        }
    }
}
