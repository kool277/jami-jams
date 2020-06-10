/*
* Copyright (C) 2020 by Savoir-faire Linux
* Authors: William Enright <william.enright@savoirfairelinux.com>
*          Ndeye Anna Ndiaye <anna.ndiaye@savoirfairelinux.com>
*          Johnny Flores <johnny.flores@savoirfairelinux.com>
*          Mohammed Raza <mohammed.raza@savoirfairelinux.com>
*          Felix Sidokhine <felix.sidokhine@savoirfairelinux.com>
*
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
package net.jami.jams.ad.connector.service;

import com.imperva.ddc.core.query.ConnectionResponse;
import com.imperva.ddc.core.query.Endpoint;
import com.imperva.ddc.service.DirectoryConnectorService;
import net.jami.jams.ad.connector.ADConnector;

public class AuthenticationService {

    public boolean authenticateUser(String username, String password) {

        Endpoint endpoint = ADConnector.getConnection(username, password);

        if (username.contains("cn=")) {
            String marked_username = username.substring(username.indexOf("cn=") + 3, username.indexOf(",")); //ADConnector.settings.getRealm() + "\\" + ADConnector.settings.getUsername();
            endpoint = ADConnector.getConnection(marked_username, password);
        }

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
