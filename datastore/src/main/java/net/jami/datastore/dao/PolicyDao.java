package net.jami.datastore.dao;

import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.dao.connectivity.SQLConnection;
import net.jami.jams.common.objects.user.Group;
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
                    "(groupName, username, policyData) VALUES (?, ?, ?)");
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
        String policyData = update.getStatements().get(0).getValue();
        String groupName = update.getStatements().get(1).getValue();
        String username = update.getStatements().get(2).getValue();
        String oldGroupName = constraints.getStatements().get(0).getValue();

        SQLConnection connection = DataStore.connectionPool.getConnection();

        try {
            PreparedStatement ps = connection.getConnection().prepareStatement("UPDATE policies SET groupName = ?, username = ?, policyData = ? WHERE groupName = ?");
            ps.setString(1, groupName);
            ps.setString(2, username);
            ps.setString(3, policyData);
            ps.setString(4, oldGroupName);
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
            PreparedStatement ps = connection.getConnection().prepareStatement("DELETE FROM policies WHERE groupName = ?");
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
