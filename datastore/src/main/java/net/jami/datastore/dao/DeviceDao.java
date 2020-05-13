package net.jami.datastore.dao;

import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.dao.connectivity.SQLConnection;
import net.jami.jams.common.objects.devices.Device;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.LinkedHashMap;

@Slf4j
public class DeviceDao extends AbstractDao<Device> {

    public DeviceDao() {
        SQLConnection connection = DataStore.connectionPool.getConnection();
        try {
            this.setTableName("devices");
            this.setTClass(Device.class);
            String createTable = "CREATE TABLE devices (" +
                    "deviceId varchar(255), " +
                    "owner varchar(255)," +
                    "displayName varchar(255)," +
                    "certificate varchar(5000), "+
                    "privatekey varchar(5000)," +
                    "PRIMARY KEY (deviceId))";
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
    public boolean storeObject(Device object) {
        SQLConnection connection = DataStore.connectionPool.getConnection();
        try{
            PreparedStatement ps = connection.getConnection().prepareStatement("INSERT INTO devices " +
                    "(deviceId, owner, displayName, certificate, privatekey) " +
                    "VALUES " +
                    "(?, ?, ?, ?, ?)");
            ps = object.getInsert(ps);
            return ps.execute();
        }
        catch (Exception e){
            log.error("An error has occurred while trying to store a user: " + e.toString());
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
