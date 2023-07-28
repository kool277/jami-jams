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
import net.jami.jams.common.cryptoengineapi.CertificateAuthority;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.system.SystemAccount;
import net.jami.jams.common.utils.LibraryLoader;

import java.util.List;

@Slf4j
public class CryptoEngineLoader {

    public static CertificateAuthority loadCertificateAuthority(
            String config, DataStore dataStore) {
        try {
            Class<?> cls = LibraryLoader.classLoader.loadClass("net.jami.jams.ca.JamsCA");
            CertificateAuthority certificateAuthority =
                    (CertificateAuthority) cls.getConstructor().newInstance();
            StatementList statementList = new StatementList();
            statementList.addStatement(new StatementElement("entity", "=", "CA", ""));
            List<SystemAccount> accounts = dataStore.getSystemDao().getObjects(statementList);
            if (accounts.size() == 0) {
                log.info(
                        "This is an fresh install, and it has no CA or any system accounts - if there is a config.json"
                                + " file in your directory, this means the install is broken and you should delete and restart!");
            } else {
                statementList = new StatementList();
                statementList.addStatement(new StatementElement("entity", "=", "CA", ""));
                SystemAccount caAccount = dataStore.getSystemDao().getObjects(statementList).get(0);
                statementList = new StatementList();
                statementList.addStatement(new StatementElement("entity", "=", "OCSP", ""));
                SystemAccount ocspAccount =
                        dataStore.getSystemDao().getObjects(statementList).get(0);
                log.info("Injecting OCSP and CA acocunts...");
                certificateAuthority.init(config, caAccount, ocspAccount);
            }
            log.info(
                    "Loaded X509 Engine - please make sure it is initialized before using it to sign requests!");
            return certificateAuthority;
        } catch (Exception e) {
            log.error("Unable to load X509 Engine!");
            return null;
        }
    }
}
