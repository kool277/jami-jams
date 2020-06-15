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
import net.jami.jams.common.objects.user.UserProfile;

import java.sql.PreparedStatement;
import java.sql.SQLException;

@Slf4j
public class UserProfileDao extends AbstractDao<UserProfile> {

    //Fis this to include the fields from AD/LDAP.
    public UserProfileDao() {
        SQLConnection connection = DataStore.connectionPool.getConnection();
        try {
            this.setTableName("local_directory");
            this.setTClass(UserProfile.class);

            String createTable  = "CREATE TABLE local_directory (" +
                    "username varchar(255), " +
                    "firstName varchar(255), " +
                    "lastName varchar(255), " +
                    "email varchar(255), " +
                    "profilePicture long varchar, " +
                    "organization varchar(255), " +
                    "phoneNumber varchar(255), " +
                    "phoneNumberExtension varchar(255), " +
                    "faxNumber varchar(255), " +
                    "mobileNumber varchar(255), " +
                    "PRIMARY KEY (username))";


            PreparedStatement ps = connection.getConnection().prepareStatement(createTable);
            ps.execute();
        }
        catch (SQLException e){
            log.error("Could not create the user profile table with error " + e.getMessage());
        }
        finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

    @Override
    public boolean storeObject(UserProfile object) {

        SQLConnection connection = DataStore.connectionPool.getConnection();
        try{
            PreparedStatement ps = connection.getConnection().prepareStatement("INSERT INTO local_directory " +
                    "(username, firstName, lastName, email, profilePicture, organization, phoneNumber, phoneNumberExtension, faxNumber, mobileNumber)" +
                    " VALUES " + "(?,?,?,?,?,?,?,?,?,?)");
            ps = object.getInsert(ps);
            return ps.executeUpdate() != 0;
        }
        catch (Exception e){
            log.error("An error has occurred while trying to store a user profile: " + e.toString());
            return false;
        }
        finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }
}
