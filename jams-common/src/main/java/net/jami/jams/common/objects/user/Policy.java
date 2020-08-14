package net.jami.jams.common.objects.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.jami.jams.common.objects.roots.X509Entity;
import net.jami.jams.common.serialization.database.DatabaseObject;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Policy implements DatabaseObject {

    private String name;
    private String policyData;

    public Policy(ResultSet rs) throws Exception {
        this.name = rs.getString("name");
        this.policyData = rs.getString("policyData");
    }

    @Override
    public PreparedStatement getInsert(PreparedStatement ps) throws Exception {
        ps.setString(1, name);
        ps.setString(2, policyData);
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
