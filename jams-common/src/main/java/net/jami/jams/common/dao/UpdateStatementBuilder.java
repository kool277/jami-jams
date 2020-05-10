package net.jami.jams.common.dao;

import net.jami.jams.common.dao.connectivity.SQLConnection;

import java.sql.PreparedStatement;
import java.util.List;

public class UpdateStatementBuilder {
    public static PreparedStatement buildStatement(String table, List<StatementElement> updateElements,
                                                   List<StatementElement> conditionalElements,
                                                   SQLConnection connection) throws Exception {
        PreparedStatement ps = null;
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("UPDATE ").append(table).append(" SET ");
        for (int i = 0; i < updateElements.size(); i++) {
            StatementElement statementElement = updateElements.get(i);
            stringBuilder
                    .append(statementElement.getColumn())
                    .append(" = ")
                    .append("?");
            if (i != updateElements.size() - 1) stringBuilder.append(",");
        }
        stringBuilder.append(" WHERE ");
        for (StatementElement statementElement : conditionalElements) {
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
        //Now we have to feed this all the elements it hsould have.
        updateElements.addAll(conditionalElements);
        int i = 1;
        for (StatementElement statementElement : updateElements) {
            ps.setString(i, statementElement.getValue());
            i++;
        }
        return ps;
    }
}
