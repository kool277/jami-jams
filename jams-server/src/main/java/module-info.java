module jams.server {
    requires cryptoengine;
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
    exports net.jami.jams.server.servlets.general to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.filters to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.api.auth to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.web to org.apache.tomcat.embed.core;
}