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
package net.jami.jams.common.authmodule;

import net.jami.jams.common.authentication.AuthenticationSource;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.jami.NameServer;
import net.jami.jams.common.objects.user.User;
import org.bouncycastle.cert.X509CRLHolder;

import java.security.cert.X509Certificate;
import java.security.interfaces.RSAPublicKey;
import java.util.concurrent.ConcurrentHashMap;

public interface AuthenticationModule {

    void attachAuthSource(AuthenticationSourceType type, String settings);
    AuthTokenResponse authenticateUser(String username, String password);
    AuthTokenResponse authenticateUser(X509Certificate[] certificates, X509CRLHolder crl, X509Certificate ca);
    ConcurrentHashMap<AuthModuleKey, AuthenticationSource> getAuthSources();
    boolean testModuleConfiguration(AuthenticationSourceType type, String configuration);
    boolean createUser(AuthenticationSourceType type, String realm, NameServer nameServer, User user);
    RSAPublicKey getAuthModulePubKey();
    char[] getOTP(String username);
}
