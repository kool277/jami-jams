package net.jami.jams.server.servlets.api.install;

import com.jsoniter.output.JsonStream;

import jakarta.servlet.annotation.WebServlet;
import net.jami.jams.ca.JamsCA;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;

@WebServlet("/api/install/lastStep")
public class InstallLastStepServlet extends HttpServlet {

    private static volatile String lastURI = "/api/jumpstart/setupCA";

    public static String getLastURI() {
        return lastURI;
    }

    public static void setLastURI(String lastURI) {
        InstallLastStepServlet.lastURI = lastURI;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setHeader("Access-Control-Allow-Origin", JamsCA.serverDomain);
        HashMap<String,String> payload = new HashMap<>();
        payload.put("uri",CachedObjects.endpoint);
        resp.setStatus(200);
        resp.getOutputStream().write(JsonStream.serialize(resp).getBytes());
    }
}
