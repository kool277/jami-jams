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
package net.jami.jams.common.dao;

import net.jami.jams.common.dao.connectivity.SQLConnection;

import java.sql.PreparedStatement;

public class SelectStatementBuilder {

    public static PreparedStatement buildStatement(String table, StatementList statementElements,
                                        StatementConstraints statementConstraints,
                                        SQLConnection connection) throws Exception
    {
        PreparedStatement ps = null;
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("SELECT * FROM ").append(table);
        if(statementElements != null) {
            stringBuilder.append(" WHERE ");
            for (StatementElement statementElement : statementElements.getStatements()) {
                stringBuilder
                        .append(statementElement.getColumn())
                        .append(" ")
                        .append(statementElement.getOperator())
                        .append(" ")
                        .append("?")
                        .append(" ")
                        .append(statementElement.getNextStatementRelation())
                        .append(" ");
            }
            ps = connection.getConnection().prepareStatement(stringBuilder.toString());
            int i = 1;
            for (StatementElement statementElement : statementElements.getStatements()) {
                ps.setString(i, statementElement.getValue());
                i++;
            }
        }
        else{
            if(statementConstraints != null){
                stringBuilder.append(" LIMIT ").append(statementConstraints.getRowCount())
                    .append(" OFFSET ").append(statementConstraints.getOffset());
            }
            ps = connection.getConnection().prepareStatement(stringBuilder.toString());
        }
        return ps;
    }


}
