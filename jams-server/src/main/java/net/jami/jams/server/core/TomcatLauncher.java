package net.jami.jams.server.core;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.server.Server;
import org.apache.catalina.WebResourceRoot;
import org.apache.catalina.core.StandardContext;
import org.apache.catalina.startup.Tomcat;
import org.apache.catalina.webresources.DirResourceSet;
import org.apache.catalina.webresources.JarResourceSet;
import org.apache.catalina.webresources.StandardRoot;

import java.io.File;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

//This class boots the tomcat server which provides the subsystem
//for the API calls.
@Slf4j
public class TomcatLauncher {

    private static final Tomcat tomcat = new Tomcat();
    private static StandardContext context;

    public void startServer() {
        tomcat.getService().addConnector(TomcatConnectorFactory.getNoSSLConnector(8080));
        String jarName = URLDecoder.decode(new File(Server.class.getProtectionDomain().getCodeSource().getLocation().getPath()).getAbsolutePath(), StandardCharsets.UTF_8);
        log.info("JAR Resource File = " + jarName);
        context = (StandardContext) tomcat.addWebapp("", new File(System.getProperty("user.dir")).getAbsolutePath());
        WebResourceRoot resources = new StandardRoot(context);
        if (jarName.contains(".jar")) {
            resources.addPreResources(new JarResourceSet(resources, "/WEB-INF/classes", jarName, "/net/jami/jams/server/servlets"));
            resources.addPreResources(new JarResourceSet(resources, "/", jarName, "/webapp"));
        }
        else {
            log.info("WARNING: You are running from your local filesystem, this makes sense only for developers!");
            StringBuilder basePath = new StringBuilder();
            String[] paths = System.getProperty("user.dir").split("/");
            for(int i=0; i < paths.length-1; i++){
                basePath.append("/").append(paths[i]);
            }
            basePath.append("/jams-server");
            resources.addPreResources(new DirResourceSet(resources, "/WEB-INF/classes", basePath.toString() + "/target/classes/net/jami/jams/server/servlets", "/"));
            resources.addPreResources(new DirResourceSet(resources, "/", basePath.toString() + "/target/classes", "/webapp"));

        }
        context.setResources(resources);
        try {
            tomcat.start();
            tomcat.getServer().await();
        } catch
        (Exception e) {
            log.error("Web-server has failed to start - this is critical!");
        }
    }


}
