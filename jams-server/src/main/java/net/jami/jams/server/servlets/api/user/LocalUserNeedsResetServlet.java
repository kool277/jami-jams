package net.jami.jams.server.servlets.api.user;


import com.jsoniter.output.JsonStream;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.ca.JamsCA;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.server.Server;
import net.jami.jams.server.servlets.api.install.CachedObjects;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.stream.Collectors;

@WebServlet("/api/user/needsreset")
@Slf4j
public class LocalUserNeedsResetServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
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
        catch (Exception e){
            log.error("error decoding request body");
        }


        if(stringBuilder.toString() != null) {

            try {
                if (CachedObjects.localAuthSettings != null && req.getParameterMap().containsKey("username")) {

                    HashMap<String,String> statusInfo = new HashMap<>();
                    String username = req.getParameter("username");

                    if(Server.dataStore.userExists(username)){
                        StatementList statementList = new StatementList();
                        StatementElement statementElement = new StatementElement("username","=",username,"");
                        statementList.addStatement(statementElement);
                        User user = Server.dataStore.getUserDao().getObjects(statementList).get(0);

                        if (user != null && user.getNeedsPasswordReset() && user.getUserType() ==  AuthenticationSourceType.LOCAL) {
                            // show the OTP modal
                            char[] otp = Server.userAuthenticationModule.getOTP(req.getParameter("username"));
                            statusInfo.put("needsReset", "true");
                            statusInfo.put("otp", new String(otp));
                        } else {
                            // change status for user, generate new password and update info
                            // Server.userAuthenticationModule.updateReset(user, 1);
                            user.setNeedsPasswordReset(false);
                            String newPW = generateRandomPassword();
                            user.setPassword(newPW);
                            Server.dataStore.getUserDao().storeObject(user);
                            statusInfo.put("needsReset", "false");
                            statusInfo.put("newPW", newPW);
                        }
                    }

                    resp.getOutputStream().write(JsonStream.serialize(statusInfo).getBytes());
                    resp.setStatus(200);
                }

            } catch (Exception e) {
                log.info(e.toString());
                resp.setStatus(500);
            }
        }
    }

    // TODO : change to char array
    public String generateRandomPassword() {
        return new SecureRandom().ints(12, 48, 58).mapToObj(i -> String.valueOf((char)i)).collect(Collectors.joining());
    }
}
