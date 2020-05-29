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
import net.jami.jams.common.dao.DeleteStatementBuilder;
import net.jami.jams.common.dao.SelectStatementBuilder;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.dao.UpdateStatementBuilder;
import net.jami.jams.common.dao.connectivity.SQLConnection;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public abstract class AbstractDao<T> {

    @Getter @Setter
    private String tableName;
    @Getter @Setter
    private Class<T> tClass;

    public abstract boolean storeObject(T object);

    public List<T> getObjects(StatementList constraints){
        List<T> result = new ArrayList<>();
        SQLConnection connection = DataStore.connectionPool.getConnection();
        try{
            PreparedStatement ps = SelectStatementBuilder.buildStatement(tableName,constraints,connection);
            ResultSet rs = ps.executeQuery();
            while(rs.next()){
                result.add(tClass.getConstructor(ResultSet.class).newInstance(rs));
            }
            return result;
        }
        catch (Exception e){
            log.error("An error has occurred while trying to fetch a device: " + e.toString());
            return null;
        }
        finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

    public boolean updateObject(StatementList update, StatementList constraints){
        SQLConnection connection = DataStore.connectionPool.getConnection();
        try{
            PreparedStatement ps = UpdateStatementBuilder.buildStatement(tableName,update,constraints,connection);
            return ps.execute();
        }
        catch (Exception e){
            log.error("An error has occurred while trying to fetch a device: " + e.toString());
            return false;
        }
        finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

    public boolean deleteObject(StatementList delete){
        SQLConnection connection = DataStore.connectionPool.getConnection();
        try{
            PreparedStatement ps = DeleteStatementBuilder.buildStatement(tableName,delete,connection);
            return ps.execute();
        }
        catch (Exception e){
            log.error("An error has occurred while trying to fetch a device: " + e.toString());
            return false;
        }
        finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

}
