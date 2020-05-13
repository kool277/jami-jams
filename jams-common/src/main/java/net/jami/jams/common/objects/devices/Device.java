package net.jami.jams.common.objects.devices;

import com.jsoniter.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.jami.jams.common.objects.roots.X509Entity;
import net.jami.jams.common.serialization.database.DatabaseObject;
import net.jami.jams.common.utils.X509Utils;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Device extends X509Entity implements DatabaseObject {

    private String deviceId;
    @JsonIgnore
    private String owner;
    private String displayName;

    public Device(ResultSet rs) throws Exception {
        this.deviceId = rs.getString("deviceId");
        this.owner = rs.getString("owner");
        this.displayName = rs.getString("displayName");
        this.setCertificate(X509Utils.getCertificateFromPEMString(rs.getString("certificate")));
        this.setPrivateKey(X509Utils.getKeyFromPEMString(rs.getString("privatekey")));
    }

    @Override
    public PreparedStatement getInsert(PreparedStatement ps) throws Exception {
        ps.setString(1, deviceId);
        ps.setString(2, owner);
        ps.setString(3,displayName);
        ps.setString(4, X509Utils.getPEMStringFromCertificate(this.getCertificate()));
        ps.setString(5, X509Utils.getPEMStringFromPrivateKey(this.getPrivateKey()));
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
