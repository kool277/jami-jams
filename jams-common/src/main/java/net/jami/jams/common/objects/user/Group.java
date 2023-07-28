package net.jami.jams.common.objects.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import net.jami.jams.common.serialization.database.DatabaseObject;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Group implements DatabaseObject {
    private String id;
    private String name;
    private String blueprint;

    public Group(ResultSet rs) throws SQLException {
        this.id = rs.getString("id");
        this.name = rs.getString("name");
        this.blueprint = rs.getString("blueprint");
    }

    @Override
    public PreparedStatement getInsert(PreparedStatement ps) throws SQLException {
        ps.setString(1, id);
        ps.setString(2, name);
        ps.setString(3, blueprint);
        return ps;
    }

    @Override
    public PreparedStatement getDelete(PreparedStatement ps) throws Exception {
        return null;
    }

    @Override
    public PreparedStatement getUpdate(PreparedStatement ps) throws Exception {
        return null;
    }

    public boolean isEmpty() {
        return this.id == null && this.name == null;
    }

    public boolean hasBlueprint() {
        return this.blueprint != null && !this.blueprint.equals("");
    }
}
