module jams.ca {
    exports net.jami.jams.ca;
    exports net.jami.jams.ca.workers.csr.builders;
    requires jams.common;
    requires org.bouncycastle.pkix;
    requires lombok;
    requires org.slf4j;
    requires org.bouncycastle.provider;
    requires jsoniter;
}