package net.jami.datastore.dao;

import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.dao.connectivity.SQLConnection;
import net.jami.jams.common.objects.user.UserGroupMapping;

import java.sql.PreparedStatement;

@Slf4j
public class UserGroupMappingsDao extends AbstractDao<UserGroupMapping>{

    public UserGroupMappingsDao() {
        this.setTableName("usergroupmappings");
        this.setTClass(UserGroupMapping.class);
    }

    @Override
    public boolean storeObject(UserGroupMapping object) {

        SQLConnection connection = DataStore.connectionPool.getConnection();
        try {
            PreparedStatement ps = connection.getConnection().prepareStatement("INSERT INTO usergroupmappings " +
                    "(username, groups)" + " VALUES " + "(?,?)");
            ps = object.getInsert(ps);
            return ps.executeUpdate() != 0;
        } catch (Exception e) {
            log.error("An error has occurred while trying to store a user profile: " + e.toString());
            return false;
        } finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

    @Override
    public boolean updateObject(StatementList update, StatementList constraints) {

        String groups = update.getStatements().get(0).getValue();
        String username = constraints.getStatements().get(0).getValue();

        SQLConnection connection = DataStore.connectionPool.getConnection();
        try {
            PreparedStatement ps = connection.getConnection().prepareStatement("UPDATE usergroupmappings SET groups = ? WHERE username = ?");
            ps.setString(1, groups);
            ps.setString(2, username);
            return ps.executeUpdate() != 0;
        } catch (Exception e) {
            log.error("An error has occurred while trying to update a user profile: " + e.toString());
            return false;
        } finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }
}
