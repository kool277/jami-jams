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

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import net.jami.datastore.main.DataStore;
import net.jami.jams.common.dao.connectivity.SQLConnection;
import net.jami.jams.common.serialization.database.DatabaseObject;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
public abstract class AbstractDao<T> {

    @Getter @Setter private String tableName;
    @Getter @Setter protected Class<T> tClass;

    public abstract boolean storeObject(T object);

    protected ResultSet executeQuery(String query) {
        return executeQuery(query, new ArrayList<>());
    }

    protected ResultSet executeQuery(String query, String param) {
        return executeQuery(query, List.of(param));
    }

    protected ResultSet executeQuery(String query, List<String> params) {
        SQLConnection connection = DataStore.connectionPool.getConnection();
        try {
            PreparedStatement ps = connection.getConnection().prepareStatement(query);
            for (int i = 0; i < params.size(); i++) {
                ps.setString(i + 1, params.get(i));
            }
            return ps.executeQuery();
        } catch (Exception e) {
            log.error("An error has occurred while trying to fetch an object:");
            e.printStackTrace();
            return null;
        } finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

    protected Optional<T> getFirstObjectFromResultSet(ResultSet rs) {
        try {
            if (rs.next()) {
                T obj = tClass.getConstructor(ResultSet.class).newInstance(rs);
                rs.close();
                return Optional.of(obj);
            }
        } catch (Exception e) {
            log.error(
                    "An error has occurred while trying to get the first result from the database:");
            e.printStackTrace();
        }

        return Optional.empty();
    }

    protected List<T> getObjectsFromResultSet(ResultSet rs) {
        List<T> result = new ArrayList<>();

        try {
            while (rs.next()) {
                result.add(tClass.getConstructor(ResultSet.class).newInstance(rs));
            }

            rs.close();
        } catch (Exception e) {
            log.error("An error has occurred while trying to get results from the database:");
            e.printStackTrace();
        }

        return result;
    }

    protected boolean executeUpdate(String query, List<String> params) {
        SQLConnection connection = DataStore.connectionPool.getConnection();

        try {
            PreparedStatement ps = connection.getConnection().prepareStatement(query);

            for (int i = 0; i < params.size(); i++) {
                ps.setString(i + 1, params.get(i));
            }

            return ps.executeUpdate() != 0;
        } catch (Exception e) {
            log.error("An error has occurred while trying to execute update:");
            e.printStackTrace();
            return false;
        } finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

    protected boolean executeInsert(String query, DatabaseObject object) {
        SQLConnection connection = DataStore.connectionPool.getConnection();

        try {
            PreparedStatement ps = connection.getConnection().prepareStatement(query);

            ps = object.getInsert(ps);

            return ps.executeUpdate() != 0;
        } catch (Exception e) {
            log.error("An error has occurred while trying to execute insert:");
            e.printStackTrace();
            return false;
        } finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }
}
