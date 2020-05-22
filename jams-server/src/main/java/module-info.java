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
    requires org.bouncycastle.pkix;
    requires org.bouncycastle.provider;
    requires jami.nameserver;
    requires jami.dht;
    requires nimbus.jose.jwt;
    requires java.desktop;
    requires java.naming;
    requires java.logging;
    requires javax.servlet.api;
    exports net.jami.jams.server.servlets.general to org.apache.tomcat.embed.core;

    exports net.jami.jams.server.servlets.filters to org.apache.tomcat.embed.core;

    exports net.jami.jams.server.servlets.api.auth.login to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.api.auth.device to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.api.auth.directory to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.api.auth.user to org.apache.tomcat.embed.core;

    exports net.jami.jams.server.servlets.api.install to org.apache.tomcat.embed.core;

    exports net.jami.jams.server.servlets.general to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.api.jaminameserver to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.x509 to org.apache.tomcat.embed.core;


}
