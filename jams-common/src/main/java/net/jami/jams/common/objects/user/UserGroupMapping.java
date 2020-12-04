package net.jami.jams.common.objects.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.jami.jams.common.serialization.database.DatabaseObject;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserGroupMapping implements DatabaseObject {

    private String username;
    private String groupId;

    public UserGroupMapping(ResultSet rs) throws Exception {
        this.username = rs.getString("username");
        this.groupId = rs.getString("groupId");
    }

    @Override
    public PreparedStatement getInsert(PreparedStatement ps) throws Exception {
        ps.setString(1, username);
        ps.setString(2, groupId);
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
