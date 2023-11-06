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

import net.jami.datastore.main.DataStore;
import net.jami.jams.common.dao.connectivity.SQLConnection;
import net.jami.jams.common.objects.contacts.Contact;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

class ContactDaoTest {
    private ContactDao contactDao;

    @BeforeEach
    void setUp() {
        DataStore dataStore = new DataStore("jdbc:derby:memory:testdb;create=true");
        SQLConnection connection = DataStore.connectionPool.getConnection();
        Assertions.assertNotNull(connection);

        contactDao = new ContactDao();
        Assertions.assertNotNull(contactDao);
    }

    @Test
    void getByOwner() throws Exception {
        Assertions.assertTrue(contactDao.getByOwner("test").isEmpty());
    }

    @Test
    void storeObject() throws Exception {
        Contact contact = new Contact();
        Assertions.assertFalse(contactDao.storeObject(contact));
    }

    @Test
    void storeContactList() throws Exception {
        ArrayList<Contact> contactList = new ArrayList<>();
        Assertions.assertFalse(contactDao.storeContactList(contactList));

        Contact contact = new Contact();
        contactList.add(contact);
        Assertions.assertFalse(contactDao.storeContactList(contactList));
    }

    @Test
    void deleteObject() throws Exception {
        Assertions.assertFalse(contactDao.removeContact("owner", "uri"));
    }
}
