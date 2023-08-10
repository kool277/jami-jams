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

package net.jami.jams.common.objects.contacts;

import com.google.gson.annotations.Expose;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import net.jami.jams.common.serialization.database.DatabaseObject;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class Contact implements DatabaseObject {

    @Expose(serialize = false)
    private String owner;

    private String uri;
    private String displayName;
    private Long timestamp;
    private Character status; // A = added, D = deleted.
    private Boolean banned = false;
    private Boolean confirmed = false;
    private String conversationId;

    public Contact(ResultSet rs) throws Exception {
        this.owner = rs.getString("owner");
        this.uri = rs.getString("uri");
        this.displayName = rs.getString("displayName");
        this.timestamp = rs.getLong("timestamp");
        this.status = (char) rs.getInt("status");
        this.banned = rs.getBoolean("banned");
        this.confirmed = rs.getBoolean("confirmed");
        this.conversationId = rs.getString("conversationId");
    }

    @Override
    public PreparedStatement getInsert(PreparedStatement ps) throws Exception {
        ps.setString(1, owner);
        ps.setString(2, uri);
        if (displayName != null) ps.setString(3, displayName);
        else ps.setString(3, "");
        ps.setLong(4, timestamp);
        ps.setInt(5, status);
        ps.setBoolean(6, banned);
        ps.setBoolean(7, confirmed);
        ps.setString(8, conversationId);
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
