package net.jami.jams.server.servlets.api.auth.device;

import com.jsoniter.JsonIterator;
import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.devices.Device;
import net.jami.jams.common.objects.requests.DeviceRegistrationRequest;
import net.jami.jams.common.objects.responses.DeviceRegistrationResponse;
import net.jami.jams.server.core.workflows.RegisterDeviceFlow;

import java.io.IOException;

import static net.jami.jams.server.Server.dataStore;

@WebServlet("/api/auth/device/*")
public class DeviceServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getAttribute("username").toString();
        String deviceId = req.getPathInfo().replace("/","");
        StatementList statementList = new StatementList();
        StatementElement st1 = new StatementElement("owner","=",username,"AND");
        StatementElement st2 = new StatementElement("deviceId","=",deviceId,"");
        statementList.addStatement(st1);
        statementList.addStatement(st2);
        resp.getOutputStream().write(JsonStream.serialize(dataStore.getDeviceDao().getObjects(statementList).get(0)).getBytes());
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        DeviceRegistrationRequest request = JsonIterator.deserialize(req.getInputStream().readAllBytes(), DeviceRegistrationRequest.class);
        DeviceRegistrationResponse devResponse = RegisterDeviceFlow.registerDevice(req.getAttribute("username").toString(),request);
        if(devResponse != null) resp.getOutputStream().write(JsonStream.serialize(devResponse).getBytes());
        else resp.sendError(500,"An exception has occurred while trying to enroll a device!");
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doPut(req, resp);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doDelete(req, resp);
    }
}
