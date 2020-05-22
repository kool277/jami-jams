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
import org.apache.catalina.connector.Connector;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;

@Slf4j
public class TomcatConnectorFactory {

    public static Connector getSSLConnectorWithTrustStore(String certificateFile, String keyFile, int port) {
        Connector connector = getSSLConnectorWithoutTrustStore(certificateFile, keyFile, port);
        if (Files.exists(Paths.get(System.getProperty("user.dir") + File.separator + "keystore.jks"))) {
            connector.setAttribute("truststoreFile", System.getProperty("user.dir") + File.separator + "keystore.jks");
            connector.setAttribute("clientAuth", "optional");
            connector.setAttribute("truststorePassword", "changeit");
        } else {
            log.error("Could not find a keystore for the SSL Connector - this is critical as client auth will not be available!");
            log.error("Proceeding to boot tomcat with just SSL parameters...");
        }
        return connector;
    }

    public static Connector getSSLConnectorWithoutTrustStore(String certificateFile, String keyFile, int port) {
        //Check if trust store exists or create it if necessary.
        Connector connector = new Connector();
        connector.setPort(port);
        connector.setSecure(true);
        connector.setScheme("https");
        connector.setAttribute("protocol", "org.apache.coyote.http11.Http11NioProtocol");
        connector.setAttribute("SSLCertificateFile", System.getProperty("user.dir") + File.separator + certificateFile);
        connector.setAttribute("SSLCertificateKeyFile", System.getProperty("user.dir") + File.separator + keyFile);
        connector.setAttribute("protocol", "HTTP/1.1");
        connector.setAttribute("sslProtocol", "TLSv1.3");
        connector.setAttribute("maxThreads", "200");
        connector.setAttribute("SSLEnabled", "true");
        return connector;
    }


    public static Connector getNoSSLConnector(int port) {
        Connector connector = new Connector();
        connector.setPort(port);
        connector.setScheme("http");
        connector.setAttribute("protocol", "org.apache.coyote.http11.Http11NioProtocol");
        connector.setAttribute("protocol", "HTTP/1.1");
        connector.setAttribute("maxThreads", "200");
        return connector;
    }


}
