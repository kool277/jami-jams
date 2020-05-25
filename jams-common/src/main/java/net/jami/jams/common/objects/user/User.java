/*
* Copyright (C) 2020 by Savoir-faire Linux
* Authors: William Enright <william.enright@savoirfairelinux.com>
*          Ndeye Anna Ndiaye <anna.ndiaye@savoirfairelinux.com>
*          Johnny Flores <johnny.flores@savoirfairelinux.com>
*          Mohammed Raza <mohammed.raza@savoirfairelinux.com>
*          Felix Sidokhine <felix.sidokhine@savoirfairelinux.com>
*
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
package net.jami.jams.common.objects.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.objects.roots.BlockchainEntity;
import net.jami.jams.common.objects.roots.X509Entity;
import net.jami.jams.common.serialization.database.DatabaseObject;
import net.jami.jams.common.utils.X509Utils;

import java.sql.PreparedStatement;
import java.sql.ResultSet;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class User extends X509Entity implements BlockchainEntity, DatabaseObject {

    private String username;
    private String password;
    private AuthenticationSourceType userType;
    private String realm; //sort of the domain.
    private AccessLevel accessLevel = AccessLevel.USER;
    private Boolean needsPasswordReset = false;

    private String ethAddress;
    private String ethKey;
    private String jamiId;

    public User(ResultSet rs) throws Exception {
        this.username = rs.getString("username");
        this.password = rs.getString("password");
        this.userType = AuthenticationSourceType.valueOf(rs.getString("userType"));
        this.accessLevel = AccessLevel.valueOf(rs.getString("accessLevel"));
        this.needsPasswordReset = Boolean.parseBoolean(rs.getString("needsPasswordReset"));
        this.realm = rs.getString("realm");
        this.ethAddress = rs.getString("ethAddress");
        this.ethKey = rs.getString("ethKey");
        this.jamiId = rs.getString("jamiId");
        if(rs.getString("certificate") != null && !rs.getString("certificate").isBlank()) {
            this.setCertificate(X509Utils.getCertificateFromPEMString(rs.getString("certificate")));
        }
        if(rs.getString("privatekey") != null && !rs.getString("privatekey").isBlank()) {
            this.setPrivateKey(X509Utils.getKeyFromPEMString(rs.getString("privatekey")));
        }
    }

    @Override
    public String getAddress() {
        return this.ethAddress;
    }

    @Override
    public void setAddress(String address) {
        this.ethAddress = address;
    }

    @Override
    public String getKey() {
        return ethKey;
    }

    @Override
    public void setKey(String key) {
        this.ethKey = key;
    }

    @Override
    public PreparedStatement getInsert(PreparedStatement ps) throws Exception {
        ps.setString(1, username);
        //We don't store the user's password if he is remote.
        if(userType != null && userType.equals(AuthenticationSourceType.LOCAL)) ps.setString(2, password);
        else ps.setString(2, null);
        if(userType != null) ps.setString(3, userType.toString());
        else ps.setString(3, null);
        ps.setString(4, realm);
        ps.setString(5, ethAddress);
        ps.setString(6, ethKey);
        ps.setString(7, jamiId);
        if (this.getCertificate() != null) {
            ps.setString(8, X509Utils.getPEMStringFromCertificate(this.getCertificate()));
        } else {
            ps.setString(8, "");
        }
        if (this.getPrivateKey() != null) {
            ps.setString(9, X509Utils.getPEMStringFromPrivateKey(this.getPrivateKey()));
        } else {
            ps.setString(9, "");
        }
        ps.setString(10,accessLevel.toString());
        ps.setString(11,needsPasswordReset.toString());
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

    public void setPassword(char[] password){
        this.password = new String(password);
    }

    public void setPassword(String password){
        this.password = password;
    }
}
