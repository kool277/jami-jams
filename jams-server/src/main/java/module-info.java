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

    exports net.jami.jams.server.servlets.general to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.filters to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.api.auth.login to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.api.auth.device to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.api.auth.directory to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.api.auth.user to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.api.install to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.api.jaminameserver to org.apache.tomcat.embed.core;
    exports net.jami.jams.server.servlets.x509 to org.apache.tomcat.embed.core;
    exports net.jami.jams.server;
    exports net.jami.jams.server.core;


}
