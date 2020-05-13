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
import net.jami.jams.common.utils.LibraryLoader;
import net.jami.jams.nameserver.LocalNameServer;
import net.jami.jams.nameserver.PublicNameServer;
import net.jami.jams.server.core.TomcatLauncher;
import net.jami.jams.server.startup.AuthModuleLoader;
import net.jami.jams.server.startup.CryptoEngineLoader;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
public class Server {

    public static AtomicBoolean isInstalled = new AtomicBoolean(false);

    static {
        JsoniterRegistry.initCodecs();
    }

    public static DataStore dataStore;
    //This one gets loaded via JAR, to make it more flexible.
    public static CertificateAuthority certificateAuthority;
    public static AuthenticationModule userAuthenticationModule;
    public static NameServer nameServer;

    public static void main(String[] args) {
        //Start tomcat.
        TomcatLauncher tomcatLauncher = new TomcatLauncher();
        tomcatLauncher.startServer();

        //Look for the config.json file locally.

        //Pre-load the libraries we should pre-load.
        LibraryLoader.loadlibs("libs",Server.class);
        //Step 1: Create the data store.
        dataStore = new DataStore("jdbc:derby:jams;create=true");

        isInstalled.set(new File(System.getProperty("user.dir") + File.separator + "config.json").exists());
        log.info("Server is already installed: " + isInstalled.get());
        ServerSettings serverSettings = null;
        if(isInstalled.get()){
            try {
                InputStream path = new FileInputStream(new File(System.getProperty("user.dir") + File.separator + "config.json"));
                serverSettings = JsonIterator.deserialize(path.readAllBytes(),ServerSettings.class);
                certificateAuthority = CryptoEngineLoader.loadCertificateAuthority(serverSettings.getCaConfiguration(),dataStore);
                userAuthenticationModule = AuthModuleLoader.loadAuthenticationModule(dataStore,certificateAuthority);
                if(serverSettings.getLdapConfiguration() != null)
                    userAuthenticationModule.attachAuthSource(AuthenticationSourceType.LDAP,
                            serverSettings.getLdapConfiguration()
                    );
                if(serverSettings.getActiveDirectoryConfiguration() != null){
                    userAuthenticationModule.attachAuthSource(AuthenticationSourceType.AD,
                            serverSettings.getActiveDirectoryConfiguration());
                }
                if(serverSettings.getLocalDirectoryConfiguration() != null){
                    LocalAuthSettings settings = JsonIterator.deserialize(serverSettings.getActiveDirectoryConfiguration(), LocalAuthSettings.class);
                    if(settings.getPublicNames()) nameServer = new PublicNameServer(settings.getPublicNameServer());
                    else nameServer = new LocalNameServer(dataStore,serverSettings.getServerPublicURI());
                }
                else nameServer = new LocalNameServer(dataStore,serverSettings.getServerPublicURI());
            }
            catch (Exception e){
                log.error("Could not load configuration file or initialize some components - this is critical");
            }
        }
        else{
            certificateAuthority = CryptoEngineLoader.loadCertificateAuthority(null,dataStore);
            userAuthenticationModule = AuthModuleLoader.loadAuthenticationModule(dataStore,certificateAuthority);
            log.info("Started server with empty modules waiting for setup...");
        }
    }
}
