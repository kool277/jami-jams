package net.jami.jams.common.dao;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class StatementList {

    private List<StatementElement> statements = new ArrayList<>();

    public void addStatement(StatementElement statementElement){
        statements.add(statementElement);
    }

}
