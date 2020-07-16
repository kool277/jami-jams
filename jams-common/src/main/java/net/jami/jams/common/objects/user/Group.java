package net.jami.jams.common.objects.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.objects.roots.X509Entity;
import net.jami.jams.common.serialization.database.DatabaseObject;
import net.jami.jams.common.utils.X509Utils;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Group implements DatabaseObject {
    private String name;
    private List<String> groupMembers;

    public Group(ResultSet rs) throws SQLException {
        this.name = rs.getString("name");
        this.groupMembers = new ArrayList<>();
    }

    @Override
    public PreparedStatement getInsert(PreparedStatement ps) throws SQLException {
        ps.setString(1, name);
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
}
