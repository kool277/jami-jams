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
