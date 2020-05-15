package net.jami.jams.server.servlets.api.admin.devices;

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

@WebServlet("/api/admin/devices")
public class DevicesServlet extends HttpServlet {

    //Get a list of devices for a user.
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getParameter("username");
        StatementList statementList = new StatementList();
        StatementElement st1 = new StatementElement("owner","=",username,"");
        statementList.addStatement(st1);
        resp.getOutputStream().write(JsonStream.serialize(dataStore.getDeviceDao().getObjects(statementList)).getBytes());
    }
}
