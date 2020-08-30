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

package net.jami.datastore.dao;

import com.nimbusds.jwt.SignedJWT;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.dao.StatementList;

import java.util.List;

@Slf4j
public class JwtDao extends AbstractDao<SignedJWT> {

    private static final String SQL_STORE_TOKEN = "INSERT INTO tokens (userid,deviceId,token) VALUES (?,?,?)";
    private static final String SQL_DELETE_TOKEN = "DELETE FROM tokens WHERE userid = ? AND deviceId = ?";
    private static final String SQL_GET_TOKEN = "SELECT COUNT(token) FROM tokens WHERE token = ?";

    public JwtDao() {
        this.setTableName("tokens");
        this.setTClass(SignedJWT.class);
    }

    @Override
    public boolean storeObject(SignedJWT object) {
        //TODO: Implement this.
        return true;
    }

    public boolean validateToken(SignedJWT signedJWT) {
        //TODO: Implement this.
        return true;
    }

    //This method is not needed because we are only concerned with the existence of a token,
    //we never actually look them up.
    @Override
    public List<SignedJWT> getObjects(StatementList constraints) {
        return null;
    }

    //TODO: Implement this method.
    @Override
    public boolean deleteObject(StatementList delete) {
        return false;
    }
}
