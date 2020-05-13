module jami.nameserver {
    requires jams.common;
    requires datastore;
    requires lombok;
    exports net.jami.jams.nameserver;
    requires org.slf4j;
    requires jsoniter;
}