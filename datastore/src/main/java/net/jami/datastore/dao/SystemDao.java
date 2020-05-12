package net.jami.datastore.dao;

import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.dao.connectivity.SQLConnection;
import net.jami.jams.common.objects.system.SystemAccount;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.LinkedHashMap;

@Slf4j
public class SystemDao extends AbstractDao<SystemAccount> {

    public SystemDao() {
        SQLConnection connection = DataStore.connectionPool.getConnection();
        try {
            this.setTableName("system");
            this.setTClass(SystemAccount.class);
            String createTable = "CREATE TABLE "+ this.getTableName() + " (" +
                    "entity varchar(255), " +
                    "certificate varchar(5000), "+
                    "privatekey varchar(5000)," +
                    "PRIMARY KEY (entity))";
            PreparedStatement ps = connection.getConnection().prepareStatement(createTable);
            ps.execute();
        }
        catch (SQLException e){
            log.error("Could not create the device table with error " + e.getMessage());
        }
        finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

    @Override
    public boolean storeObject(SystemAccount object) {
        SQLConnection connection = DataStore.connectionPool.getConnection();
        try{
            PreparedStatement ps = connection.getConnection().prepareStatement("INSERT INTO system " +
                    "(entity,certificate,privatekey)" +
                    "VALUES " +
                    "(?, ?, ?)");
            ps = object.getInsert(ps);
            return ps.execute();
        }
        catch (Exception e){
            log.error("An error has occurred while trying to store a system entity: " + e.toString());
            return false;
        }
        finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

    @Override
    public boolean deleteObject(LinkedHashMap<String, String> constraints) {
        return false;
    }
}
