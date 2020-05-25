/*
* Copyright (C) 2020 by Savoir-faire Linux
* Authors: William Enright <william.enright@savoirfairelinux.com>
*          Ndeye Anna Ndiaye <anna.ndiaye@savoirfairelinux.com>
*          Johnny Flores <johnny.flores@savoirfairelinux.com>
*          Mohammed Raza <mohammed.raza@savoirfairelinux.com>
*          Felix Sidokhine <felix.sidokhine@savoirfairelinux.com>
*
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
package net.jami.jams.server.core;

import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.WebResourceRoot;
import org.apache.catalina.core.StandardContext;
import org.apache.catalina.startup.Tomcat;
import org.apache.catalina.webresources.DirResourceSet;
import org.apache.catalina.webresources.JarResourceSet;
import org.apache.catalina.webresources.StandardRoot;

import java.awt.*;
import java.io.File;
import java.net.URI;


//This class boots the tomcat server which provides the subsystem
//for the API calls.
@Slf4j
public class TomcatLauncher {

    private Tomcat tomcat = null;

    public TomcatLauncher(int port) {
        tomcat = new Tomcat();
        tomcat.getService().addConnector(TomcatConnectorFactory.getNoSSLConnector(port));
        this.startServer();
    }

    public TomcatLauncher(int port, String certificateFile, String keyFile) {
        //If running in SSL mode, we need a trusts store in order to let clients authenticate.
        //In this case this is a bit of a dirty hack...
        log.error("This functionality is not yet implemented!");
    }


    public void startServer() {
        String jarName = System.getProperty("user.dir") + File.separator + "jams-server.jar";
        log.info("JAR Resource File = " + jarName);
        StandardContext context = (StandardContext) tomcat.addWebapp("", new File(System.getProperty("user.dir")).getAbsolutePath());
        //Hack to prevent useless verbose messages.

        context.getJarScanner().setJarScanFilter((jarScanType, s) -> false);
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
        //We always go to login by default.
        context.addWelcomeFile("web/login");
        try {
            tomcat.start();
            //Try to pop-up Web-UI
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                Desktop.getDesktop().browse(new URI("https://localhost:8080"));
            }
            else log.info("There is no graphical interface on this system - please connect remotely!");
        } catch
        (Exception e) {
            log.error("Web-server has failed to start - this is critical, error {}",e.getMessage());
        }
    }

    public void stopTomcat(){
        try {
            synchronized (tomcat) {
                tomcat.stop();
                tomcat.destroy();
            }
        }
        catch (Exception e){
            log.info("Failed to stop tomcat server with error {}",e.getMessage());
        }
    }
}
