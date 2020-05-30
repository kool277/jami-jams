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
package net.jami.jams.server;

import com.jsoniter.JsonIterator;
import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.authentication.local.LocalAuthSettings;
import net.jami.jams.common.authmodule.AuthenticationModule;
import net.jami.jams.common.cryptoengineapi.CertificateAuthority;
import net.jami.jams.common.jami.NameServer;
import net.jami.jams.common.serialization.JsoniterRegistry;
import net.jami.jams.common.server.ServerSettings;
import net.jami.jams.common.updater.AppUpdater;
import net.jami.jams.common.utils.LibraryLoader;
import net.jami.jams.nameserver.LocalNameServer;
import net.jami.jams.nameserver.PublicNameServer;
import net.jami.jams.server.core.TomcatLauncher;
import net.jami.jams.server.licensing.LicenseService;
import net.jami.jams.server.startup.AuthModuleLoader;
import net.jami.jams.server.startup.CryptoEngineLoader;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
//In order to make this "stoppable" to simply, I turned the server itself into a thread.
//The reasoning: the main two problems
public class Server {

    public final static AtomicBoolean isInstalled = new AtomicBoolean(false);
    public final static AtomicBoolean activated = new AtomicBoolean(false);

    static {
        JsoniterRegistry.initCodecs();
    }

    public static DataStore dataStore;
    //This one gets loaded via JAR, to make it more flexible.
    public static CertificateAuthority certificateAuthority;
    public static AuthenticationModule userAuthenticationModule;
    public static NameServer nameServer;
    public static TomcatLauncher tomcatLauncher = null;
    public static LicenseService licenseService = new LicenseService();
    public static AppUpdater appUpdater;

    public Server(AppUpdater appUpdater, String port, String serverCertificate, String serverPrivateKey) {
        Server.appUpdater = appUpdater;

        String[] args = {port, serverCertificate, serverPrivateKey};

        if ((args.length > 0)) main(args);
        else main(new String[]{});
    }


    public void main(String[] args) {
        //Start tomcat.
        switch (args.length) {
            case 0:
                tomcatLauncher = new TomcatLauncher(8080);
                break;
            case 1:
                tomcatLauncher = new TomcatLauncher(Integer.parseInt(args[0]));
                break;
            case 3:
                tomcatLauncher = new TomcatLauncher(Integer.parseInt(args[0]), args[1], args[2]);
                break;
            default:
                log.error("Incorrect number of start arguments provided!");
                System.exit(-1);
                break;
        }

        //Look for the config.json file locally.

        //Pre-load the libraries we should pre-load.
        LibraryLoader.loadlibs("libs", Server.class);
        //Step 1: Create the data store.
        dataStore = new DataStore("jdbc:derby:jams;create=true");

        isInstalled.set(new File(System.getProperty("user.dir") + File.separator + "config.json").exists());
        log.info("Server is already installed: " + isInstalled.get());
        ServerSettings serverSettings = null;
        if (isInstalled.get()) {
            try {
                InputStream path = new FileInputStream(new File(System.getProperty("user.dir") + File.separator + "config.json"));
                serverSettings = JsonIterator.deserialize(path.readAllBytes(), ServerSettings.class);
                certificateAuthority = CryptoEngineLoader.loadCertificateAuthority(serverSettings.getCaConfiguration(), dataStore);
                userAuthenticationModule = AuthModuleLoader.loadAuthenticationModule(dataStore, certificateAuthority);
                if (serverSettings.getLdapConfiguration() != null)
                    userAuthenticationModule.attachAuthSource(AuthenticationSourceType.LDAP,
                            serverSettings.getLdapConfiguration()
                    );
                if (serverSettings.getActiveDirectoryConfiguration() != null) {
                    userAuthenticationModule.attachAuthSource(AuthenticationSourceType.AD,
                            serverSettings.getActiveDirectoryConfiguration());
                }
                if (serverSettings.getLocalDirectoryConfiguration() != null) {
                    LocalAuthSettings settings = JsonIterator.deserialize(serverSettings.getActiveDirectoryConfiguration(), LocalAuthSettings.class);
                    if(settings.getPublicNames()) nameServer = new PublicNameServer(settings.getPublicNameServer());
                    else nameServer = new LocalNameServer(dataStore,userAuthenticationModule,serverSettings.getServerPublicURI());
                }
                else nameServer = new LocalNameServer(dataStore,userAuthenticationModule,serverSettings.getServerPublicURI());

                licenseService.loadLicense();
                log.info("All services are UP and ready for use...");
            } catch (Exception e) {
                log.error("Could not load configuration file or initialize some components - this is critical");
            }
        } else {
            certificateAuthority = CryptoEngineLoader.loadCertificateAuthority(null, dataStore);
            userAuthenticationModule = AuthModuleLoader.loadAuthenticationModule(dataStore, certificateAuthority);
            log.info("Started server with empty modules waiting for setup...");
        }
    }
}
