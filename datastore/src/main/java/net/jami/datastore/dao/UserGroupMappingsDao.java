package net.jami.datastore.dao;

import lombok.extern.slf4j.Slf4j;

import net.jami.jams.common.objects.user.UserGroupMapping;

import java.util.List;
import java.util.Optional;

@Slf4j
public class UserGroupMappingsDao extends AbstractDao<UserGroupMapping> {

    public UserGroupMappingsDao() {
        this.setTableName("usergroupmappings");
        this.setTClass(UserGroupMapping.class);
    }

    public List<UserGroupMapping> getByGroupId(String groupId) {
        return getObjectsFromResultSet(
                "SELECT * FROM usergroupmappings WHERE groupId = ?", groupId);
    }

    public List<UserGroupMapping> getByUsername(String username) {
        return getObjectsFromResultSet(
                "SELECT * FROM usergroupmappings WHERE username = ?", username);
    }

    public Optional<UserGroupMapping> getByGroupIdAndUsername(String groupId, String username) {
        // TODO The primary key should be (groupId, username)
        String query = "SELECT * FROM usergroupmappings WHERE groupId = ? AND username = ?";
        List<String> params = List.of(groupId, username);
        return getFirstObjectFromResultSet(query, params);
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
