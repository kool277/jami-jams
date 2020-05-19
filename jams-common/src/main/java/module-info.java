/**
 *
 * These may be required for tests to complete.
 *
 * //--add-opens
 * //        java.base/sun.security.rsa=jsoniter
 * //        --add-opens
 * //        java.base/sun.security.pkcs=jsoniter
 * //        --add-opens
 * //        java.base/sun.security.x509=jsoniter
 * //        --add-opens
 * //        java.base/sun.security.util=jsoniter
 * //        --add-opens
 * //        java.base/java.security.cert=jsoniter
 * //        --add-opens
 * //        java.base/java.lang=jsoniter
 * //        --add-opens
 * //        java.base/java.lang=javassist
 */

module jams.common {
    opens net.jami.jams.common.cryptoengineapi;
    opens net.jami.jams.common.utils;
    opens net.jami.jams.common.serialization;
    opens net.jami.jams.common.jami;
    requires lombok;
    requires org.slf4j;
    requires org.bouncycastle.pkix;
    requires org.bouncycastle.provider;
    requires jsoniter;
    requires javassist;
    opens net.jami.jams.common.objects.roots;
    opens net.jami.jams.common.objects.requests;
    exports net.jami.jams.common.objects.user;
    exports net.jami.jams.common.objects.devices;
    exports net.jami.jams.common.cryptoengineapi;
    exports net.jami.jams.common.utils;
    exports net.jami.jams.common.serialization;
    exports net.jami.jams.common.objects.system;
    exports net.jami.jams.common.objects.roots;
    exports net.jami.jams.common.objects.contacts;
    exports net.jami.jams.common.objects.requests;
    exports net.jami.jams.common.authentication;
    exports net.jami.jams.common.dao;
    exports net.jami.jams.common.dao.connectivity;
    exports net.jami.jams.common.authentication.activedirectory;
    opens net.jami.jams.common.authentication.activedirectory to ad.connector ;
    exports net.jami.jams.common.authentication.ldap;
    exports net.jami.jams.common.jami;
    exports net.jami.jams.common.authmodule;
    exports net.jami.jams.common.server;
    exports net.jami.jams.common.authentication.local;
    exports net.jami.jams.common.objects.responses;
    exports net.jami.jams.common.cryptoengineapi.ocsp;
    exports net.jami.jams.common.updater;
    requires jdk.crypto.cryptoki;
    requires java.base;
    requires java.sql;
    requires org.apache.xbean.classloader;
}

