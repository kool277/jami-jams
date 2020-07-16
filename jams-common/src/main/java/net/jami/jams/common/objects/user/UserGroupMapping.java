package net.jami.jams.common.objects.user;

import com.jsoniter.JsonIterator;
import com.jsoniter.output.JsonStream;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.jami.jams.common.serialization.database.DatabaseObject;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Arrays;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserGroupMapping implements DatabaseObject {

    private String username;
    private String groups;

    public UserGroupMapping(ResultSet rs) throws Exception {
        this.username = rs.getString("username");
        this.groups = rs.getString("groups");
    }

    public void addGroup(String s) {
        if (this.groups.equals(""))
            this.groups = s;
        else
            this.groups = this.groups.concat("," + s);
    }

    @Override
    public PreparedStatement getInsert(PreparedStatement ps) throws Exception {
        ps.setString(1, username);
        ps.setString(2, groups);
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
