package net.jami.jams.common.dao;

import net.jami.jams.common.dao.connectivity.SQLConnection;

import java.sql.PreparedStatement;
import java.util.List;

public class SelectStatementBuilder {

    public static PreparedStatement buildStatement(String table, List<StatementElement> statementElements,
                                        SQLConnection connection) throws Exception
    {
        PreparedStatement ps = null;
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("SELECT * FROM ").append(table);
        if(statementElements != null) {
            stringBuilder.append(" WHERE ");
            for (StatementElement statementElement : statementElements) {
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
            for (StatementElement statementElement : statementElements) {
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
