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
import org.apache.catalina.connector.Connector;
import org.apache.catalina.core.StandardContext;
import org.apache.catalina.startup.Tomcat;
import org.apache.catalina.webresources.DirResourceSet;
import org.apache.catalina.webresources.JarResourceSet;
import org.apache.catalina.webresources.StandardRoot;
import org.apache.tomcat.util.descriptor.web.ErrorPage;

import java.awt.*;
import java.io.File;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;

import static net.jami.jams.server.Server.certificateAuthority;

//This class boots the tomcat server which provides the subsystem
//for the API calls.
@Slf4j
public class TomcatLauncher {

    private final Tomcat tomcat = new Tomcat();
    private StandardContext context;

    public TomcatLauncher(int port) {
        tomcat.getService().addConnector(TomcatConnectorFactory.getNoSSLConnector(port));
        this.startServer();
    }

    public TomcatLauncher(int port, String certificateFile, String keyFile) {
        if (!Files.exists(Paths.get(System.getProperty("user.dir") + File.separator + certificateFile)) ||
            !Files.exists(Paths.get(System.getProperty("user.dir") + File.separator + keyFile))) {
            log.info("Could not find certificate or keyfile, starting in plain HTTP connector as fallback!");
            tomcat.getService().addConnector(TomcatConnectorFactory.getNoSSLConnector(port));
            this.startServer();
            return;
        }
        if (Files.exists(Paths.get(System.getProperty("user.dir") + File.separator + "keystore.jks"))) {
            log.info("Found a valid trust store, injecting into tomcat!");
            tomcat.getService().addConnector(TomcatConnectorFactory.getSSLConnectorWithTrustStore(certificateFile, keyFile, port));
        } else {
            Connector connector = TomcatConnectorFactory.getSSLConnectorWithoutTrustStore(certificateFile, keyFile, port);
            tomcat.getService().addConnector(connector);
        }
        this.startServer();
    }

    public void startServer() {
        String jarName = System.getProperty("user.dir") + File.separator + "jams-server.jar";
        log.info("JAR Resource File = " + jarName);
        context = (StandardContext) tomcat.addWebapp("", new File(System.getProperty("user.dir")).getAbsolutePath());
        context.getJarScanner().setJarScanFilter((jarScanType, s) -> false);
        log.info("Serving application from: " + new File(System.getProperty("user.dir")).getAbsolutePath());

        WebResourceRoot resources = new StandardRoot(context);
        //We probably need to scan the annotations here, because they should be loaded AFTER the classes are loaded.
        if (jarName.contains(".jar")) {
            resources.addPreResources(new JarResourceSet(resources, "/WEB-INF/classes", jarName, "/net/jami/jams/server/servlets"));
            resources.addPreResources(new JarResourceSet(resources, "/", jarName, "/webapp"));
        } else {
            log.info("WARNING: You are running from your local filesystem, this makes sense only for developers!");
            StringBuilder basePath = new StringBuilder();
            String[] paths = System.getProperty("user.dir").split("/");
            for (int i = 0; i < paths.length - 1; i++) {
                basePath.append("/").append(paths[i]);
            }
            basePath.append("/jams-server");
            resources.addPreResources(new DirResourceSet(resources, "/WEB-INF/classes", basePath.toString() + "/target/classes/net/jami/jams/server/servlets", "/"));
            resources.addPreResources(new DirResourceSet(resources, "/", basePath.toString() + "/target/classes", "/webapp"));
        }
        context.setResources(resources);
        //We always go to login by default.
        context.addWelcomeFile("index");
        ErrorPage errorPage = new ErrorPage();
        errorPage.setErrorCode(404);
        errorPage.setLocation("/index");
        context.addErrorPage(errorPage);
        try {
            tomcat.start();
            //Try to pop-up Web-UI
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                Desktop.getDesktop().browse(new URI(tomcat.getConnector().getScheme() + "://localhost:8080/templates/signup.html"));
            } else {
                log.info("There is no graphical interface on this system - please connect remotely!");
            }
        } catch (Exception e) {
            log.error("Could not start web-server!");
        }
    }

    public void stopTomcat() {
        try {
            synchronized (tomcat) {
                certificateAuthority.shutdownThreads();
                tomcat.stop();
                context.destroy();
                tomcat.destroy();
            }
        } catch (Exception e) {
            log.info("Failed to stop tomcat server with error {}", e.getMessage());
        }
    }
}
