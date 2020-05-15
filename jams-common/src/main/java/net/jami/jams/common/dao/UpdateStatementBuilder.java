package net.jami.jams.common.dao;

import net.jami.jams.common.dao.connectivity.SQLConnection;

import java.sql.PreparedStatement;
import java.util.List;

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
