module jami.dht {
    exports net.jami.jams.dht;
    requires lombok;
    requires msgpack.core;
    requires org.apache.commons.codec;
    requires org.slf4j;
    requires jams.common;
}