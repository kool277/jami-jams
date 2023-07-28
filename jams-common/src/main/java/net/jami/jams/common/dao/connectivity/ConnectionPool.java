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
package net.jami.jams.common.dao.connectivity;

import lombok.extern.slf4j.Slf4j;

import java.sql.DriverManager;
import java.util.concurrent.ConcurrentLinkedQueue;

@Slf4j
public class ConnectionPool {

    private final ConcurrentLinkedQueue<SQLConnection> connections = new ConcurrentLinkedQueue<>();
    private String connectionURI;

    // Load Derby class.

    public ConnectionPool(String connectionURI) {
        try {
            Class.forName("org.apache.derby.jdbc.EmbeddedDriver");
            this.connectionURI = connectionURI;
            while (connections.size() < 10) {
                try {
                    connections.add(new SQLConnection(DriverManager.getConnection(connectionURI)));
                } catch (Exception e) {
                    log.error("Could not create a link with the database: " + e);
                }
            }
        } catch (Exception e) {
            log.error("Could not load ApacheDerby class driver: " + e);
        }
    }

    public SQLConnection getConnection() {
        try {
            SQLConnection sqlConnection = null;
            while (sqlConnection == null) {
                sqlConnection = connections.poll();
            }
            if (sqlConnection.isStale())
                sqlConnection = new SQLConnection(DriverManager.getConnection(connectionURI));
            return sqlConnection;
        } catch (Exception e) {
            log.info("A connection could not be obtained with error " + e);
            return null;
        }
    }

    public void returnConnection(SQLConnection sqlConnection) {
        try {
            if (sqlConnection.isStale()) {
                sqlConnection.getConnection().close();
                sqlConnection = new SQLConnection(DriverManager.getConnection(connectionURI));
            }
            connections.add(sqlConnection);
        } catch (Exception e) {
            log.error("Could not return a connection!");
        }
    }
}
