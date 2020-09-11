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
import net.jami.jams.common.objects.user.User;

import java.sql.PreparedStatement;

@Slf4j
public class UserDao extends AbstractDao<User> {

    public UserDao() {
        this.setTableName("users");
        this.setTClass(User.class);
    }

    @Override
    public boolean storeObject(User object) {
        SQLConnection connection = DataStore.connectionPool.getConnection();
        try {
            PreparedStatement ps = connection.getConnection().prepareStatement("INSERT INTO users " +
                "(username, password, userType, realm, ethAddress, ethKey, jamiId,certificate, privatekey, accessLevel, needsPasswordReset, salt) " +
                " VALUES " + "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            ps = object.getInsert(ps);
            return ps.executeUpdate() != 0;
        } catch (Exception e) {
            log.error("An error has occurred while trying to store a user: " + e.toString());
            return false;
        } finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

    @Override
    public boolean updateObject(StatementList update, StatementList constraints) {

        String pw = update.getStatements().get(0).getValue();
        String salt = "";
        if (update.getStatements().size() > 1)
            salt = update.getStatements().get(1).getValue();

        String user = constraints.getStatements().get(0).getValue();
//        String pwReset = "false";
//
//        if (update.getStatements().size() > 1) {
//            pwReset = update.getStatements().get(1).getValue();
//        }

        SQLConnection connection = DataStore.connectionPool.getConnection();

        try {
            PreparedStatement ps = connection.getConnection().prepareStatement("UPDATE users SET password = ?, salt = ? WHERE username = ?");
            ps.setString(1, pw);
            ps.setString(2, salt);
            ps.setString(3, user);
//            ps.executeUpdate();
//
//            ps = connection.getConnection().prepareStatement("UPDATE users SET needsPasswordReset = ? WHERE username = ?");
//            ps.setString(1, pwReset);
//
//            ps.setString(2, user);
            return ps.executeUpdate() != 0;
        } catch (Exception e) {
            log.error("An error has occurred while trying to update a user: " + e.toString());
            return false;
        } finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }
}
