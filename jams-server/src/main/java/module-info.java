module jams.server {
    requires jams.ca;
    requires jams.common;
    requires java.management;
    requires lombok;
    requires org.slf4j;
    requires org.apache.tomcat.embed.core;
    requires tomcat.annotations.api;
    requires jsoniter;
    requires javassist;
    requires datastore;
    requires org.apache.xbean.classloader;
    requires jami.nameserver;
    requires jami.dht;
    requires nimbus.jose.jwt;
    requires java.desktop;
    exports net.jami.jams.server.servlets.general to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.filters to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.api.auth.login to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.api.auth.device to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.api.install to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.api.jaminameserver to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.x509 to org.apache.tomcat.embed.core;
}