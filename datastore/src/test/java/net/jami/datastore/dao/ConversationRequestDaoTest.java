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

import net.jami.datastore.main.DataStore;
import net.jami.jams.common.dao.connectivity.SQLConnection;
import net.jami.jams.common.objects.conversations.ConversationRequest;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

class ConversationRequestDaoTest {
    private ConversationRequestDao conversationRequestDao;

    @BeforeEach
    void setUp() {
        DataStore dataStore = new DataStore("jdbc:derby:memory:testdb;create=true");
        SQLConnection connection = DataStore.connectionPool.getConnection();
        Assertions.assertNotNull(connection);

        conversationRequestDao = new ConversationRequestDao();
        Assertions.assertNotNull(conversationRequestDao);
    }

    @Test
    void getByOwner() throws Exception {
        Assertions.assertTrue(conversationRequestDao.getByOwner("test").isEmpty());
    }

    @Test
    void storeObject() throws Exception {
        ConversationRequest conversationRequest = new ConversationRequest();
        Assertions.assertFalse(conversationRequestDao.storeObject(conversationRequest));
    }

    @Test
    void storeConversationRequestList() throws Exception {
        ArrayList<ConversationRequest> conversationList = new ArrayList<>();
        Assertions.assertFalse(
                conversationRequestDao.storeConversationRequestList(conversationList));

        ConversationRequest conversationRequest = new ConversationRequest();
        conversationList.add(conversationRequest);
        Assertions.assertFalse(
                conversationRequestDao.storeConversationRequestList(conversationList));
    }
}
