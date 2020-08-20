package net.jami.datastore.dao;

import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.dao.connectivity.SQLConnection;
import net.jami.jams.common.objects.user.Group;

import java.sql.PreparedStatement;
import java.sql.SQLException;

@Slf4j
public class GroupDao extends AbstractDao<Group>{

    public GroupDao() {
        this.setTableName("groups");
        this.setTClass(Group.class);
    }

    @Override
    public boolean storeObject(Group object) {
        SQLConnection connection = DataStore.connectionPool.getConnection();
        try{
            PreparedStatement ps = connection.getConnection().prepareStatement("INSERT INTO groups " +
                    "(name, blueprint) VALUES (?, ?)");
            ps = object.getInsert(ps);
            return ps.executeUpdate() != 0;
        }
        catch (SQLException e){
            log.error("An error has occurred while trying to store a group: " + e.toString());
            return false;
        }
        finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

    @Override
    public boolean updateObject(StatementList update, StatementList constraints) {

        String name = update.getStatements().get(0).getValue();
        String blueprint = update.getStatements().get(1).getValue();
        String oldName = constraints.getStatements().get(0).getValue();

        SQLConnection connection = DataStore.connectionPool.getConnection();

        try{
            PreparedStatement ps = connection.getConnection().prepareStatement("UPDATE groups SET name = ?, blueprint = ? WHERE name = ?");
            ps.setString(1, name);
            ps.setString(2, blueprint);
            ps.setString(3, oldName);
            return ps.executeUpdate() != 0;
        }
        catch (SQLException e){
            log.error("An error has occurred while trying to update a group: " + e.toString());
            return false;
        }
        finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

    @Override
    public boolean deleteObject(StatementList constraints) {

        String name = constraints.getStatements().get(0).getValue();
        SQLConnection connection = DataStore.connectionPool.getConnection();

        try {
            PreparedStatement ps = connection.getConnection().prepareStatement("DELETE FROM groups WHERE name = ?");
            ps.setString(1, name);
            return ps.executeUpdate() != 0;
        } catch (SQLException e){
            log.error("An error has occurred while trying to delete a group: " + e.toString());
            return false;
        } finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

}
