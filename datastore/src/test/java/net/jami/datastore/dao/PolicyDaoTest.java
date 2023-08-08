/*
 * Copyright (C) 2023 by Savoir-faire Linux
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
import net.jami.jams.common.objects.user.Policy;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

@Slf4j
class PolicyDaoTest {
    private PolicyDao policyDao;

    @BeforeEach
    void beforeEach() throws Exception {
        DataStore dataStore = new DataStore("jdbc:derby:memory:testdb;create=true");
        SQLConnection connection = DataStore.connectionPool.getConnection();
        Assertions.assertNotNull(connection);

        policyDao = new PolicyDao();
        Assertions.assertNotNull(policyDao);
    }

    @Test
    void getAll() throws Exception {
        Assertions.assertTrue(policyDao.getAll().isEmpty());
    }

    @Test
    void getByName() throws Exception {
        Assertions.assertTrue(policyDao.getByName("test").isEmpty());
    }

    @Test
    void getByUsername() throws Exception {
        Assertions.assertTrue(policyDao.getByUsername("test").isEmpty());
    }

    @Test
    void storeObject() throws Exception {
        Policy policyData = new Policy();
        Assertions.assertFalse(policyDao.storeObject(policyData));
    }

    @Test
    void updateObject() throws Exception {
        Assertions.assertFalse(policyDao.updateObject("name", "policyData"));
    }

    @Test
    void deleteObject() throws Exception {
        Assertions.assertFalse(policyDao.deleteObject("name"));
    }
}
