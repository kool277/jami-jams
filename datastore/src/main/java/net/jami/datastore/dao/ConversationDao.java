/*
 * Copyright (C) 2023 by Savoir-faire Linux
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
import net.jami.jams.common.objects.conversations.Conversation;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.List;

@Slf4j
public class ConversationDao extends AbstractDao<Conversation> {

    public ConversationDao() {
        this.setTableName("conversations");
        this.setTClass(Conversation.class);
    }

    public List<Conversation> getByOwner(String owner) {
        ResultSet rs = executeQuery("SELECT * FROM conversations WHERE owner = ?", owner);
        return getObjectsFromResultSet(rs);
    }

    @Override
    public boolean storeObject(Conversation object) {
        String query =
                "INSERT INTO conversations (owner, id, created, removed, erased, members, lastDisplayed)"
                        + " VALUES (?, ?, ?, ?, ?, ?, ?)";
        return executeInsert(query, object);
    }

    public boolean storeConversationList(List<Conversation> conversationList) {
        if (conversationList.isEmpty()) {
            log.error("Cannot store empty conversation list");
            return false;
        }

        SQLConnection connection = DataStore.connectionPool.getConnection();
        try {
            // Initiate transaction
            connection.getConnection().setAutoCommit(false);
            String update =
                    "UPDATE conversations SET created = ?, removed = ?, erased = ?, members = ?, lastDisplayed = ?"
                            + "WHERE owner = ? AND id = ?";

            String insert =
                    "INSERT INTO conversations (owner, id, created, removed, erased, members, lastDisplayed) VALUES "
                            + "(?, ?, ?, ?, ?, ?, ?)";
            for (Conversation conversation : conversationList) {
                PreparedStatement updatePs = connection.getConnection().prepareStatement(update);
                conversation.getUpdate(updatePs);
                int rowsUpdated = updatePs.executeUpdate();

                if (rowsUpdated == 0) {
                    // If no rows were updated, perform an insert
                    PreparedStatement insertPs =
                            connection.getConnection().prepareStatement(insert);
                    conversation.getInsert(insertPs);
                    insertPs.executeUpdate();
                }
            }
            // Commit transaction
            connection.getConnection().commit();
            return true;
        } catch (Exception e) {
            log.error("Could not update conversations: {}", e.getMessage());
            return false;
        } finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }
}
