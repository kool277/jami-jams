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

public class UpdateStatementBuilder {
    public static PreparedStatement buildStatement(String table, StatementList updateElements,
                                                   StatementList conditionalElements,
                                                   SQLConnection connection) throws Exception {
        PreparedStatement ps = null;
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("UPDATE ").append(table).append(" SET ");
        for (int i = 0; i < updateElements.getStatements().size(); i++) {
            StatementElement statementElement = updateElements.getStatements().get(i);
            stringBuilder
                    .append(statementElement.getColumn())
                    .append(" = ")
                    .append("?");
            if (i != updateElements.getStatements().size() - 1) stringBuilder.append(",");
        }
        stringBuilder.append(" WHERE ");
        for (StatementElement statementElement : conditionalElements.getStatements()) {
            stringBuilder
                    .append(statementElement.getColumn())
                    .append(" ")
                    .append(statementElement.getOperator())
                    .append(" ")
                    .append("?")
                    .append(" ")
                    .append(statementElement.getNextStatementRelation());
        }
        ps = connection.getConnection().prepareStatement(stringBuilder.toString());
        //Now we have to feed this all the elements it should have.
        updateElements.getStatements().addAll(conditionalElements.getStatements());
        int i = 1;
        for (StatementElement statementElement : updateElements.getStatements()) {
            ps.setString(i, statementElement.getValue());
            i++;
        }
        return ps;
    }
}
