package net.jami.datastore.dao;

import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.dao.connectivity.SQLConnection;
import net.jami.jams.common.objects.user.Policy;

import java.sql.PreparedStatement;
import java.sql.SQLException;

@Slf4j
public class PolicyDao extends AbstractDao<Policy> {

    public PolicyDao() {
        this.setTableName("policies");
        this.setTClass(Policy.class);
    }

    @Override
    public boolean storeObject(Policy object) {
        SQLConnection connection = DataStore.connectionPool.getConnection();
        try {
            PreparedStatement ps = connection.getConnection().prepareStatement("INSERT INTO policies " +
                    "(name, policyData) VALUES (?, ?)");
            ps = object.getInsert(ps);
            return ps.executeUpdate() != 0;
        } catch (Exception e) {
            log.error("An error has occurred while trying to store a blueprint: " + e.toString());
            return false;
        } finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

    @Override
    public boolean updateObject(StatementList update, StatementList constraints) {
        String name = update.getStatements().get(0).getValue();
        String policyData = update.getStatements().get(1).getValue();
        String oldName = constraints.getStatements().get(0).getValue();

        SQLConnection connection = DataStore.connectionPool.getConnection();

        try {
            PreparedStatement ps = connection.getConnection().prepareStatement("UPDATE policies SET name = ?, policyData = ? WHERE name = ?");
            ps.setString(1, name);
            ps.setString(2, policyData);
            ps.setString(3, oldName);
            return ps.executeUpdate() != 0;
        } catch (Exception e) {
            log.error("An error has occurred while trying to update a blueprint: " + e.toString());
            return false;
        } finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

    @Override
    public boolean deleteObject(StatementList constraints) {

        String name = constraints.getStatements().get(0).getValue();
        SQLConnection connection = DataStore.connectionPool.getConnection();

        try {
            PreparedStatement ps = connection.getConnection().prepareStatement("DELETE FROM policies WHERE name = ?");
            ps.setString(1, name);
            return ps.executeUpdate() != 0;
        } catch (SQLException e){
            log.error("An error has occurred while trying to delete a blueprint: " + e.toString());
            return false;
        } finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }
}
