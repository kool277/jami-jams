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
import net.jami.jams.common.objects.conversations.ConversationRequest;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.List;

@Slf4j
public class ConversationRequestDao extends AbstractDao<ConversationRequest> {

    public ConversationRequestDao() {
        this.setTableName("conversations");
        this.setTClass(ConversationRequest.class);
    }

    public List<ConversationRequest> getByOwner(String owner) {
        ResultSet rs = executeQuery("SELECT * FROM conversation_requests WHERE owner = ?", owner);
        return getObjectsFromResultSet(rs);
    }

    @Override
    public boolean storeObject(ConversationRequest object) {
        String query =
                "INSERT INTO conversation_requests (owner, conversationId, sender, metadatas, received, declined)"
                        + " VALUES (?, ?, ?, ?, ?, ?)";
        return executeInsert(query, object);
    }

    public boolean storeConversationRequestList(List<ConversationRequest> conversationRequestList) {
        if (conversationRequestList.isEmpty()) {
            log.error("Cannot store empty conversationRequest list");
            return false;
        }

        SQLConnection connection = DataStore.connectionPool.getConnection();
        try {
            // Initiate transaction
            connection.getConnection().setAutoCommit(false);
            String update =
                    "UPDATE conversation_requests SET sender = ?, metadatas = ?, received = ?, declined = ?"
                            + "WHERE owner = ? AND conversationId = ?";

            String insert =
                    "INSERT INTO conversation_requests (owner, conversationId, sender, metadatas, received, declined) VALUES "
                            + "(?, ?, ?, ?, ?, ?)";
            for (ConversationRequest conversationRequest : conversationRequestList) {
                PreparedStatement updatePs = connection.getConnection().prepareStatement(update);
                conversationRequest.getUpdate(updatePs);
                int rowsUpdated = updatePs.executeUpdate();

                if (rowsUpdated == 0) {
                    // If no rows were updated, perform an insert
                    PreparedStatement insertPs =
                            connection.getConnection().prepareStatement(insert);
                    conversationRequest.getInsert(insertPs);
                    insertPs.executeUpdate();
                }
            }
            // Commit transaction
            connection.getConnection().commit();
            return true;
        } catch (Exception e) {
            log.error("Could not update conversationRequests: {}", e.getMessage());
            return false;
        } finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }
}
