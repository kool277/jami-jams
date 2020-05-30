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
import org.apache.tomcat.util.net.SSLHostConfig;
import org.apache.tomcat.util.net.SSLHostConfigCertificate;

import java.io.File;

@Slf4j
public class TomcatConnectorFactory {

    public static Connector getSSLConnectorWithTrustStore(String certificateFile, String keyFile, int port) {
        log.info(System.getProperty("user.dir") + File.separator + "keystore.jks");
        Connector connector = getSSLConnectorWithoutTrustStore(certificateFile, keyFile, port);
        //connector.setAttribute("truststoreFile", System.getProperty("user.dir") + File.separator + "keystore.jks");
        //connector.setAttribute("clientAuth", "optional");
        //connector.setAttribute("truststorePassword", "changeit");
        return connector;
    }

    public static Connector getSSLConnectorWithoutTrustStore(String certificateFile, String keyFile, int port) {
        //Check if trust store exists or create it if necessary.
        Connector connector = new Connector();
        SSLHostConfig sslConfig = new SSLHostConfig();
        SSLHostConfigCertificate sslHostConfigCertificate = new SSLHostConfigCertificate(sslConfig, SSLHostConfigCertificate.Type.RSA);
        sslHostConfigCertificate.setCertificateFile(System.getProperty("user.dir") + File.separator + certificateFile);
        sslHostConfigCertificate.setCertificateKeyFile(System.getProperty("user.dir") + File.separator + keyFile);
        sslConfig.addCertificate(sslHostConfigCertificate);
        sslConfig.setProtocols("TLSv1.3");
        connector.addSslHostConfig(sslConfig);
        connector.setPort(port);
        connector.setSecure(true);
        connector.setScheme("https");
        connector.setProperty("SSLEnabled", "true");
        return connector;
    }


    public static Connector getNoSSLConnector(int port) {
        Connector connector = new Connector();
        connector.setPort(port);
        connector.setScheme("http");
        return connector;
    }


}
