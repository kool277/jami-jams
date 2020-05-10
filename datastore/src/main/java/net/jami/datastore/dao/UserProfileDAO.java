package net.jami.datastore.dao;

import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.dao.connectivity.SQLConnection;
import net.jami.jams.common.objects.user.UserProfile;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.LinkedHashMap;

@Slf4j
public class UserProfileDAO extends AbstractDao<UserProfile> {

    //Fis this to include the fields from AD/LDAP.
    public UserProfileDAO() {
        SQLConnection connection = DataStore.connectionPool.getConnection();
        try {
            this.setTableName("system");
            this.setTClass(UserProfile.class);
            String createTable = "CREATE TABLE directory (" +
                    "username varchar(255), " +
                    "telephone varchar(5000), "+
                    "picture varchar(5000)," +
                    "PRIMARY KEY (username))";
            PreparedStatement ps = connection.getConnection().prepareStatement(createTable);
            ps.execute();
        }
        catch (SQLException e){
            log.error("Could not create the user profile table with error " + e.getMessage());
        }
        finally {
            DataStore.connectionPool.returnConnection(connection);
        }
    }

    @Override
    public boolean storeObject(UserProfile object) {
        return false;
    }

    @Override
    public boolean deleteObject(LinkedHashMap<String, String> constraints) {
        return false;
    }
}
