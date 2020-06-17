package net.jami.datastore.dao;

import com.nimbusds.jwt.SignedJWT;
import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.dao.connectivity.SQLConnection;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

@Slf4j
public class JwtDao extends AbstractDao<SignedJWT> {

    private static final String SQL_STORE_TOKEN  = "INSERT INTO tokens (userid,deviceId,token) VALUES (?,?,?)";
    private static final String SQL_DELETE_TOKEN = "DELETE FROM tokens WHERE userid = ? AND deviceId = ?";
    private static final String SQL_GET_TOKEN    = "SELECT COUNT(token) FROM tokens WHERE token = ?";

    public JwtDao() {
        SQLConnection connection = DataStore.connectionPool.getConnection();
        try {
            this.setTableName("tokens");
            this.setTClass(SignedJWT.class);
            String createTable = "CREATE TABLE tokens (" +
                "userid varchar(255), " +
                "deviceId varchar(255)," +
                "token varchar(255)," +
                "PRIMARY KEY (userid, deviceId))";
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
    public boolean storeObject(SignedJWT object) {
        //TODO: Implement this.
        return true;
    }

    public boolean validateToken(SignedJWT signedJWT){
        //TODO: Implement this.
        return true;
    }


    //This method is not needed because we are only concerned with the existence of a token,
    //we never actually look them up.
    @Override
    public List<SignedJWT> getObjects(StatementList constraints) {
        return null;
    }

    //TODO: Implement this method.
    @Override
    public boolean deleteObject(StatementList delete) {
        return false;
    }
}
