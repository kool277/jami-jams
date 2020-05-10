package net.jami.jams.common.dao;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StatementElement {
    private String column;
    private String operator;
    private String value;
    private String nextStatementRelation;
}
