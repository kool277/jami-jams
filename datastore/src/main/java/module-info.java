module datastore {
    exports net.jami.datastore.main;
    requires jams.common;
    requires lombok;
    requires org.slf4j;
    requires java.sql;
    requires derby;
    requires java.base;
    exports net.jami.datastore.dao;
}