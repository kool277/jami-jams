package net.jami.jams.server.servlets.api.update;

import com.jsoniter.output.JsonStream;
import net.jami.jams.ca.JamsCA;
import net.jami.jams.common.cryptoengineapi.CertificateAuthority;
import net.jami.jams.common.utils.LicenseUtils;
import net.jami.jams.server.Server;
import net.jami.jams.server.licensing.LicenseService;
import net.jami.jams.server.startup.CryptoEngineLoader;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;


@WebServlet("/api/auth/license")
public class LicenseServlet extends HttpServlet {


    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", JamsCA.serverDomain);
        resp.setContentType("application/json");
        try {
            resp.setStatus(200);
            HashMap<String,Object> payload = new HashMap<>();
            payload.put("isActive", Server.isActivated());
            payload.put("licenseType", new LicenseService().getLicenseType());
            payload.put("currentVersion", LicenseUtils.checkVersion(System.getProperty("user.dir") + "/tmpjar/", System.getProperty("user.dir") + "/jams-server.jar"));
            resp.getOutputStream().write(JsonStream.serialize(payload).getBytes());
        }
        catch (Exception e){
            resp.setStatus(403);
        }
    }

}