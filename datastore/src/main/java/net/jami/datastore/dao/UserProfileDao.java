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
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.dao.connectivity.SQLConnection;
import net.jami.jams.common.objects.user.UserProfile;

import java.sql.PreparedStatement;

@Slf4j
public class UserProfileDao extends AbstractDao<UserProfile> {

    //Fis this to include the fields from AD/LDAP.
    public UserProfileDao() {
        this.setTableName("local_directory");
        this.setTClass(UserProfile.class);
    }

    @Override
    public boolean storeObject(UserProfile object) {

        SQLConnection connection = DataStore.connectionPool.getConnection();
        try {
            PreparedStatement ps = connection.getConnection().prepareStatement("INSERT INTO local_directory " +
                "(username, firstName, lastName, email, profilePicture, organization, phoneNumber, phoneNumberExtension, faxNumber, mobileNumber)" +
                " VALUES " + "(?,?,?,?,?,?,?,?,?,?)");
            ps = object.getInsert(ps);
            return ps.executeUpdate() != 0;
        } catch (Exception e) {
            log.error("An error has occurred while trying to store a user profile: " + e.toString());
            return false;
        } finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

    @Override
    public boolean updateObject(StatementList update, StatementList constraints) {

        SQLConnection connection = DataStore.connectionPool.getConnection();
        try {
            PreparedStatement ps = connection.getConnection().prepareStatement("UPDATE local_directory SET firstname = ?, lastName = ?, email = ?, profilePicture = ?, organization = ?, phoneNumber = ?, phoneNumberExtension = ?, faxNumber = ?, mobileNumber = ? WHERE username = ?");
            for (int i = 1; i < update.getStatements().size(); i++) {
                ps.setString(i, update.getStatements().get(i).getValue());
            }
            ps.setString(update.getStatements().size(), update.getStatements().get(0).getValue());
            return ps.executeUpdate() != 0;
        } catch (Exception e) {
            log.error("An error has occurred while trying to update a user profile: " + e.toString());
            return false;
        } finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }
}
