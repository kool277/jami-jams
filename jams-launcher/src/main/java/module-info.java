
module jams.launcher {
    opens com.google.guava;
    opens org.zeromq.ZMQ;
    requires lombok;
    requires org.slf4j;
    requires jsoniter;
    requires javassist;
    requires jdk.crypto.cryptoki;
    requires java.base;
    requires java.sql;
    requires jeromq;
    requires guava;
    requires org.apache.httpcomponents.httpcore;
    requires org.apache.httpcomponents.httpclient;
    requires plexus.utils;
    requires updater;
}

