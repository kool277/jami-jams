package net.jami.jams.common.serialization.database;

import java.sql.PreparedStatement;

public interface DatabaseObject {

    PreparedStatement getInsert(PreparedStatement ps) throws Exception;
    PreparedStatement getDelete(PreparedStatement ps) throws Exception;
    PreparedStatement getUpdate(PreparedStatement ps) throws Exception;
}
