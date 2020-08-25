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
import net.jami.jams.common.objects.contacts.Contact;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

@Slf4j
public class ContactDao extends AbstractDao<Contact> {

    public ContactDao() {
        this.setTableName("contacts");
        this.setTClass(Contact.class);
    }

    //Not used because the strategy here is different.
    @Override
    public boolean storeObject(Contact object) {
        SQLConnection connection = DataStore.connectionPool.getConnection();
        try {
            String insert = "INSERT INTO contacts (owner, uri, displayName, `timestamp`, status) VALUES " +
                "(?, ?, ?, ?, ?)";
            PreparedStatement ps = connection.getConnection().prepareStatement(insert);
            object.getInsert(ps);
            ps.executeQuery();
            return true;
        } catch (Exception e) {
            log.error("Could not update contacts!");
            return false;
        } finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

    public boolean storeContactList(List<Contact> contactList) {
        SQLConnection connection = DataStore.connectionPool.getConnection();
        try {
            String delete = "DELETE FROM contacts WHERE owner = ?";
            PreparedStatement ps = connection.getConnection().prepareStatement(delete);
            ps.setString(1, contactList.get(0).getOwner());
            ps.executeUpdate();
            String insert = "INSERT INTO contacts (owner, uri, displayName, timestamp, status,banned,confirmed) VALUES " +
                "(?, ?, ?, ?, ?,?,?)";
            for (Contact contact : contactList) {
                ps = connection.getConnection().prepareStatement(insert);
                contact.getInsert(ps);
                ps.executeUpdate();
            }
            return true;
        } catch (Exception e) {
            log.error("Could not update contacts: {}",e.getMessage());
            return false;
        } finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

    @Override
    public boolean deleteObject(StatementList constraints) {
        SQLConnection connection = DataStore.connectionPool.getConnection();

        try {
            PreparedStatement ps = connection.getConnection().prepareStatement("DELETE FROM contacts WHERE owner = ? AND uri = ?");
            ps.setString(1, constraints.getStatements().get(0).getValue());
            ps.setString(2, constraints.getStatements().get(1).getValue());
            return ps.executeUpdate() != 0;
        } catch (SQLException e){
            log.error("Could not delete contact: " + e.toString());
            return false;
        } finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }
}
