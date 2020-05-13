package net.jami.jams.server.servlets.api.auth.device;

import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;

import java.io.IOException;

import static net.jami.jams.server.Server.dataStore;

@WebServlet("/api/auth/devices")
public class DevicesServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getAttribute("username").toString();
        StatementList statementList = new StatementList();
        statementList.addStatement(new StatementElement("owner","=",username,""));
        resp.getOutputStream().write(JsonStream.serialize(dataStore.getDeviceDao().getObjects(statementList)).getBytes());
    }


}
