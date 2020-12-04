package net.jami.datastore.dao;

import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.dao.connectivity.SQLConnection;
import net.jami.jams.common.objects.user.UserGroupMapping;

import java.sql.PreparedStatement;
import java.sql.SQLException;

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
                    "(username, groupId)" + " VALUES " + "(?,?)");
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
    public boolean deleteObject(StatementList constraints) {

        String username = constraints.getStatements().get(0).getValue();
        String groupId = constraints.getStatements().get(1).getValue();
        SQLConnection connection = DataStore.connectionPool.getConnection();

        try {
            if(username.equals("*")){
                PreparedStatement ps = connection.getConnection().prepareStatement("DELETE FROM usergroupmappings WHERE groupId = ?");
                ps.setString(1, groupId);
                return ps.executeUpdate() != 0;
            }
            else {
                PreparedStatement ps = connection.getConnection().prepareStatement("DELETE FROM usergroupmappings WHERE username = ? AND groupId = ?");
                ps.setString(1, username);
                ps.setString(2, groupId);
                return ps.executeUpdate() != 0;
            }
        } catch (SQLException e){
            log.error("An error has occurred while trying to delete a group member: " + e.toString());
            return false;
        } finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

}
