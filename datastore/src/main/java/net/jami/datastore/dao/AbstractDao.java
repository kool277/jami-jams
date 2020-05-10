package net.jami.datastore.dao;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.dao.SelectStatementBuilder;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.dao.connectivity.SQLConnection;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

@Slf4j
public abstract class AbstractDao<T> {

    @Getter @Setter
    private String tableName;
    @Getter @Setter
    private Class<T> tClass;

    public List<T> getObjects(StatementList constraints){
        List<T> result = new ArrayList<>();
        SQLConnection connection = DataStore.connectionPool.getConnection();
        try{
            PreparedStatement ps = SelectStatementBuilder.buildStatement(tableName,constraints.getStatements(),connection);
            ResultSet rs = ps.executeQuery();
            while(rs.next()){
                result.add(tClass.getConstructor(ResultSet.class).newInstance(rs));
            }
            return result;
        }
        catch (Exception e){
            log.error("An error has occurred while trying to fetch a device: " + e.toString());
            return null;
        }
        finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }


    public abstract boolean storeObject(T object);
    public abstract boolean deleteObject(LinkedHashMap<String,String> constraints);
}
