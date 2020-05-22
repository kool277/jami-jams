/*
* Copyright (C) 2020 by Savoir-faire Linux
* Authors: William Enright <william.enright@savoirfairelinux.com>
*          Ndeye Anna Ndiaye <anna.ndiaye@savoirfairelinux.com>
*          Johnny Flores <johnny.flores@savoirfairelinux.com>
*          Mohammed Raza <mohammed.raza@savoirfairelinux.com>
*          Felix Sidokhine <felix.sidokhine@savoirfairelinux.com>
*
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
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
    requires jeromq;
}

