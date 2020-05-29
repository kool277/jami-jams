package net.jami.jams.common.dao;

import net.jami.jams.common.dao.connectivity.SQLConnection;

import java.sql.PreparedStatement;

public class DeleteStatementBuilder {

    public static PreparedStatement buildStatement(String table, StatementList statementElements,
                                                   SQLConnection connection) throws Exception {
        PreparedStatement ps = null;
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("DELETE FROM ").append(table);
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
                    .append(statementElement.getNextStatementRelation());
            }
            ps = connection.getConnection().prepareStatement(stringBuilder.toString());
            int i = 1;
            for (StatementElement statementElement : statementElements.getStatements()) {
                ps.setString(i, statementElement.getValue());
                i++;
            }
        }
        else{
            ps = connection.getConnection().prepareStatement(stringBuilder.toString());
        }
        return ps;
    }
}
