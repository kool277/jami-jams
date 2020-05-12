package net.jami.jams.common.objects.system;

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
public class SystemAccount extends X509Entity implements DatabaseObject {

    private SystemAccountType systemAccountType;

    public SystemAccount(ResultSet rs) throws Exception {
        this.systemAccountType = SystemAccountType.valueOf(rs.getString("entity"));
        this.setCertificate(X509Utils.getCertificateFromPEMString(rs.getString("certificate")));
        this.setPrivateKey(X509Utils.getKeyFromPEMString(rs.getString("privatekey")));
    }

    @Override
    public PreparedStatement getInsert(PreparedStatement ps) throws Exception {
        ps.setString(1, systemAccountType.toString());
        ps.setString(2, X509Utils.getPEMStringFromCertificate(this.getCertificate()));
        ps.setString(3,X509Utils.getPEMStringFromPrivateKey(this.getPrivateKey()));
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
