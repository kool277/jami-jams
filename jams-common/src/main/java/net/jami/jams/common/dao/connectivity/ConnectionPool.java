package net.jami.jams.common.dao.connectivity;

import lombok.extern.slf4j.Slf4j;

import java.sql.DriverManager;
import java.util.concurrent.ConcurrentLinkedQueue;

@Slf4j
public class ConnectionPool {

    private final ConcurrentLinkedQueue<SQLConnection> connections = new ConcurrentLinkedQueue<>();
    private String connectionURI;

    //Load Derby class.

    public ConnectionPool(String connectionURI) {
        try {
            Class.forName("org.apache.derby.jdbc.EmbeddedDriver");
            this.connectionURI = connectionURI;
            while (connections.size() < 10) {
                try {
                    connections.add(new SQLConnection(DriverManager.getConnection(connectionURI)));
                } catch (Exception e) {
                    log.error("Could not create a link with the database: " + e.toString());
                }
            }
        }
        catch (Exception e){
            log.error("Could not load ApacheDerby class driver: " + e.toString());
        }
    }

    public SQLConnection getConnection(){
        try {
            SQLConnection sqlConnection = null;
            while (sqlConnection == null) {
                sqlConnection = connections.poll();
            }
            if (sqlConnection.isStale()) sqlConnection = new SQLConnection(DriverManager.getConnection(connectionURI));
            return sqlConnection;
        }
        catch (Exception e){
            log.info("A connection could not be obtained with error " + e.toString());
            return null;
        }
    }

    public void returnConnection(SQLConnection sqlConnection){
        try {
            if (sqlConnection.isStale()){
                sqlConnection.getConnection().close();
                sqlConnection = new SQLConnection(DriverManager.getConnection(connectionURI));
            }
            connections.add(sqlConnection);
        }
        catch (Exception e){
            log.error("Could not return a connection!");
        }
    }
}
