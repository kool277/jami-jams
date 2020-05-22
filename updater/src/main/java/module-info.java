module updater {
    exports net.jami.jams.updater;
    requires jams.common;
    requires lombok;
    requires org.slf4j;
    requires jsoniter;
    requires guava;
    requires org.apache.httpcomponents.httpclient;
    requires org.apache.httpcomponents.httpcore;
    requires plexus.utils;
    requires jeromq;

}