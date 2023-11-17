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
import net.jami.jams.common.objects.conversations.Conversation;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

class ConversationDaoTest {
    private ConversationDao conversationDao;

    @BeforeEach
    void setUp() {
        DataStore dataStore = new DataStore("jdbc:derby:memory:testdb;create=true");
        SQLConnection connection = DataStore.connectionPool.getConnection();
        Assertions.assertNotNull(connection);

        conversationDao = new ConversationDao();
        Assertions.assertNotNull(conversationDao);
    }

    @Test
    void getByOwner() throws Exception {
        Assertions.assertTrue(conversationDao.getByOwner("test").isEmpty());
    }

    @Test
    void storeObject() throws Exception {
        Conversation conversation = new Conversation();
        Assertions.assertFalse(conversationDao.storeObject(conversation));
    }

    @Test
    void storeCoList() throws Exception {
        ArrayList<Conversation> conversationList = new ArrayList<>();
        Assertions.assertFalse(conversationDao.storeConversationList(conversationList));

        Conversation conversation = new Conversation();
        conversationList.add(conversation);
        Assertions.assertFalse(conversationDao.storeConversationList(conversationList));
    }
}
