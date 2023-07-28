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

import net.jami.jams.common.objects.devices.Device;

import java.sql.ResultSet;
import java.util.List;
import java.util.Optional;

@Slf4j
public class DeviceDao extends AbstractDao<Device> {

    public DeviceDao() {
        this.setTableName("devices");
        this.setTClass(Device.class);
    }

    public List<Device> getByOwner(String owner) {
        ResultSet rs = executeQuery("SELECT * FROM devices WHERE owner = ?", List.of(owner));
        return getObjectsFromResultSet(rs);
    }

    public Optional<Device> getByDeviceIdAndOwner(String deviceId, String owner) {
        // TODO deviceId is the primary key, owner is possibly a useless field
        String query = "SELECT * FROM devices WHERE deviceId = ? AND owner = ?";
        ResultSet rs = executeQuery(query, List.of(deviceId, owner));
        return getFirstObjectFromResultSet(rs);
    }

    @Override
    public boolean storeObject(Device object) {
        String query =
                "INSERT INTO devices "
                        + "(deviceId, owner, displayName, certificate, privatekey) "
                        + "VALUES "
                        + "(?, ?, ?, ?, ?)";
        return executeInsert(query, object);
    }

    public boolean updateObject(String deviceName, String username, String deviceId) {
        String query = "UPDATE devices SET displayName = ? WHERE owner = ? AND deviceId = ?";
        return executeUpdate(query, List.of(deviceName, username, deviceId));
    }
}
