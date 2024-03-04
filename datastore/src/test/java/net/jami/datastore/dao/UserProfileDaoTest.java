/*
 * Copyright (C) 2020-2024 by Savoir-faire Linux
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

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

@Slf4j
class UserProfileDaoTest {
    private UserProfileDao userProfileDao;

    @BeforeEach
    void beforeEach() throws Exception {
        DataStore dataStore = new DataStore("jdbc:derby:memory:testdb;create=true");
        SQLConnection connection = DataStore.connectionPool.getConnection();
        Assertions.assertNotNull(connection);

        userProfileDao = new UserProfileDao();
        Assertions.assertNotNull(userProfileDao);
    }

    @Test
    void insertIfNotExists() throws Exception {
        UserProfile userProfile = new UserProfile();
        userProfileDao.insertIfNotExists(userProfile);
    }

    @Test
    void getAll() throws Exception {
        Assertions.assertTrue(userProfileDao.getAllUserProfile().isEmpty());
    }

    @Test
    void searchUsername() throws Exception {
        Assertions.assertTrue(userProfileDao.searchUsername("test").isEmpty());
    }

    @Test
    void searchFullName() throws Exception {
        Assertions.assertTrue(userProfileDao.searchFullName("test").isEmpty());
    }

    @Test
    void getByUsername() throws Exception {
        Assertions.assertTrue(userProfileDao.getByUsername("test").isEmpty());
    }

    @Test
    void storeObject() throws Exception {
        UserProfile userProfile = new UserProfile();
        Assertions.assertFalse(userProfileDao.storeObject(userProfile));
    }

    @Test
    void updateUserProfile() throws Exception {
        UserProfile userProfile = new UserProfile();
        Assertions.assertFalse(userProfileDao.updateUserProfile(userProfile));
    }
}
