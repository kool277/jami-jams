package net.jami.datastore.dao;

import lombok.extern.slf4j.Slf4j;

import net.jami.jams.common.objects.user.UserGroupMapping;

import java.sql.ResultSet;
import java.util.List;
import java.util.Optional;

@Slf4j
public class UserGroupMappingsDao extends AbstractDao<UserGroupMapping> {

    public UserGroupMappingsDao() {
        this.setTableName("usergroupmappings");
        this.setTClass(UserGroupMapping.class);
    }

    public List<UserGroupMapping> getByGroupId(String groupId) {
        ResultSet rs = executeQuery("SELECT * FROM usergroupmappings WHERE groupId = ?", groupId);
        return getObjectsFromResultSet(rs);
    }

    public List<UserGroupMapping> getByUsername(String username) {
        ResultSet rs = executeQuery("SELECT * FROM usergroupmappings WHERE username = ?", username);
        return getObjectsFromResultSet(rs);
    }

    public Optional<UserGroupMapping> getByGroupIdAndUsername(String groupId, String username) {
        // TODO The primary key should be (groupId, username)
        String query = "SELECT * FROM usergroupmappings WHERE groupId = ? AND username = ?";
        List<String> params = List.of(groupId, username);
        ResultSet rs = executeQuery(query, params);
        return getFirstObjectFromResultSet(rs);
    }

    @Override
    public boolean storeObject(UserGroupMapping object) {
        String query =
                "INSERT INTO usergroupmappings " + "(username, groupId)" + " VALUES " + "(?, ?)";
        return executeInsert(query, object);
    }

    public boolean deleteObject(String username, String groupId) {
        if (username.equals("*")) {
            String query = "DELETE FROM usergroupmappings WHERE groupId = ?";
            return executeUpdate(query, List.of(groupId));
        }

        String query = "DELETE FROM usergroupmappings WHERE username = ? AND groupId = ?";
        return executeUpdate(query, List.of(username, groupId));
    }
}
