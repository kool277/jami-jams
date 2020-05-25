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
package net.jami.datastore.dao;

import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.dao.connectivity.SQLConnection;
import net.jami.jams.common.objects.user.User;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.LinkedHashMap;

@Slf4j
public class UserDao extends AbstractDao<User> {

    public UserDao() {
        SQLConnection connection = DataStore.connectionPool.getConnection();
        try {
            this.setTableName("users");
            this.setTClass(User.class);
            String createTable = "CREATE TABLE users (" +
                    "username varchar(255), " +
                    "password varchar(255)," +
                    "userType varchar(10)," +
                    "realm varchar(255)," +
                    "ethAddress varchar(255)," +
                    "ethKey varchar(255)," +
                    "jamiId varchar(255)," +
                    "certificate varchar(5000), "+
                    "privatekey varchar(5000)," +
                    "accessLevel varchar(10),"+
                    "needsPasswordReset varchar(10),"+
                    "PRIMARY KEY (username))";
            PreparedStatement ps = connection.getConnection().prepareStatement(createTable);
            ps.execute();
        }
        catch (SQLException e){
            log.error("Could not create the device table with error " + e.getMessage());
        }
        finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

    @Override
    public boolean storeObject(User object) {
        SQLConnection connection = DataStore.connectionPool.getConnection();
        try{
            PreparedStatement ps = connection.getConnection().prepareStatement("INSERT INTO users " +
                    "(username, password, userType, realm, ethAddress, ethKey, jamiId,certificate, privatekey, accessLevel," +
                    "needsPasswordReset) " +
                    "VALUES " +
                    "(?, ?, ?, ?, ?, ?, ?,?, ?,?, ?)");
            ps = object.getInsert(ps);
            return ps.execute();
        }
        catch (Exception e){
            log.error("An error has occurred while trying to store a user: " + e.toString());
            return false;
        }
        finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }


    @Override
    public boolean deleteObject(LinkedHashMap<String, String> constraints) {
        return false;
    }
}
