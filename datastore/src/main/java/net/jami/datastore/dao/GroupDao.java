package net.jami.datastore.dao;

import lombok.extern.slf4j.Slf4j;

import net.jami.jams.common.objects.user.Group;

import java.util.List;
import java.util.Optional;

@Slf4j
public class GroupDao extends AbstractDao<Group> {

    public GroupDao() {
        this.setTableName("groups");
        this.setTClass(Group.class);
    }

    public List<Group> getAll() {
        return getObjectsFromResultSet("SELECT * FROM groups");
    }

    public Optional<Group> getById(String id) {
        return getFirstObjectFromResultSet("SELECT * FROM groups WHERE id = ?", List.of(id));
    }

    @Override
    public boolean storeObject(Group object) {
        String query = "INSERT INTO groups " + "(id, name, blueprint) VALUES (?, ?, ?)";
        return executeInsert(query, object);
    }

    public boolean updateObject(String id, String name, String blueprint) {
        String query = "UPDATE groups SET name = ?, blueprint = ? WHERE id = ?";
        return executeUpdate(query, List.of(name, blueprint, id));
    }

    public boolean deleteObject(String id) {
        String query = "DELETE FROM groups WHERE id = ?";
        return executeUpdate(query, List.of(id));
    }
}
