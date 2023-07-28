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
package net.jami.jams.server.startup;

import lombok.extern.slf4j.Slf4j;

import net.jami.datastore.main.DataStore;
import net.jami.jams.common.authmodule.AuthenticationModule;
import net.jami.jams.common.cryptoengineapi.CertificateAuthority;
import net.jami.jams.common.utils.LibraryLoader;

@Slf4j
public class AuthModuleLoader {

    public static AuthenticationModule loadAuthenticationModule(
            DataStore dataStore, CertificateAuthority certificateAuthority) {
        try {
            Class<?> cls =
                    LibraryLoader.classLoader.loadClass(
                            "net.jami.jams.authmodule.UserAuthenticationModule");
            AuthenticationModule authenticationModule =
                    (AuthenticationModule)
                            cls.getConstructor(DataStore.class, CertificateAuthority.class)
                                    .newInstance(dataStore, certificateAuthority);
            log.info("Loaded Authentication Module succesfully!");
            return authenticationModule;
        } catch (Exception e) {
            log.error("Unable to load Authentication Module!");
            return null;
        }
    }
}
