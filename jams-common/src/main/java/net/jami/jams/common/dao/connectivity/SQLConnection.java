package net.jami.jams.common.dao.connectivity;

import lombok.Getter;
import lombok.Setter;

import java.sql.Connection;

@Getter
@Setter
public class SQLConnection {

    private static final long TIMEOUT = 30_000L;
    private Connection connection;
    private long creationTimestamp;

    public SQLConnection(Connection connection) {
        this.connection = connection;
        this.creationTimestamp = System.currentTimeMillis();
    }

    public boolean isStale(){
        return (System.currentTimeMillis() - creationTimestamp > TIMEOUT);
    }

}
