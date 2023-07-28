package net.jami.datastore.dao;

import lombok.extern.slf4j.Slf4j;

import net.jami.jams.common.objects.user.Policy;

import java.sql.ResultSet;
import java.util.List;
import java.util.Optional;

@Slf4j
public class PolicyDao extends AbstractDao<Policy> {

    public PolicyDao() {
        this.setTableName("policies");
        this.setTClass(Policy.class);
    }

    public List<Policy> getAll() {
        ResultSet rs = executeQuery("SELECT * FROM policies");
        return getObjectsFromResultSet(rs);
    }

    public Optional<Policy> getByName(String name) {
        String q = "SELECT * FROM policies WHERE name = ?";
        ResultSet rs = executeQuery(q, List.of(name));
        return getFirstObjectFromResultSet(rs);
    }

    public Optional<Policy> getByUsername(String username) {
        // TODO this can return multiple policies
        String query =
                "SELECT * FROM usergroupmappings ugm"
                        + " JOIN groups g ON ugm.groupid = g.id"
                        + " JOIN policies p ON g.blueprint = p.name"
                        + " WHERE ugm.username = ?";
        ResultSet rs = executeQuery(query, List.of(username));
        return getFirstObjectFromResultSet(rs);
    }

    @Override
    public boolean storeObject(Policy object) {
        String query = "INSERT INTO policies (name, policyData) VALUES (?, ?)";
        return executeInsert(query, object);
    }

    public boolean updateObject(String name, String policyData) {
        String query = "UPDATE policies SET policyData = ? WHERE name = ?";
        return executeUpdate(query, List.of(policyData, name));
    }

    public boolean deleteObject(String name) {
        String query = "DELETE FROM policies WHERE name = ?";
        return executeUpdate(query, List.of(name));
    }
}
