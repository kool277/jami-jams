package net.jami.jams.ad.connector.service;

import com.imperva.ddc.core.query.ConnectionResponse;
import com.imperva.ddc.core.query.Endpoint;
import com.imperva.ddc.service.DirectoryConnectorService;
import net.jami.jams.ad.connector.ADConnector;

public class AuthenticationService {

    public boolean authenticateUser(String username, String password) {
        Endpoint endpoint = ADConnector.getConnection(username, password);
        try {
            ConnectionResponse connectionResponse = DirectoryConnectorService.authenticate(endpoint);
            return !connectionResponse.isError();
        }
        catch (Exception e){
            return false;
        }
        finally {
            ADConnector.returnConnection(endpoint);
        }
    }


}
