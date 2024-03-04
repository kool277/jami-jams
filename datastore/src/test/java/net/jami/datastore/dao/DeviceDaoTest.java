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
import net.jami.jams.common.objects.devices.Device;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

@Slf4j
class DeviceDaoTest {
    private DeviceDao deviceDao;

    @BeforeEach
    void beforeEach() throws Exception {
        DataStore dataStore = new DataStore("jdbc:derby:memory:testdb;create=true");
        SQLConnection connection = DataStore.connectionPool.getConnection();
        Assertions.assertNotNull(connection);

        deviceDao = new DeviceDao();
        Assertions.assertNotNull(deviceDao);
    }

    @Test
    void getByOwner() throws Exception {
        Assertions.assertTrue(deviceDao.getByOwner("test").isEmpty());
    }

    @Test
    void getByDeviceIdAndOwner() throws Exception {
        Assertions.assertTrue(deviceDao.getByDeviceIdAndOwner("deviceid", "owner").isEmpty());
    }

    @Test
    void storeObject() throws Exception {
        Device device = new Device();
        Assertions.assertFalse(deviceDao.storeObject(device));
    }

    @Test
    void updateObject() throws Exception {
        Assertions.assertFalse(deviceDao.updateObject("devicename", "username", "deviceid"));
    }
}
