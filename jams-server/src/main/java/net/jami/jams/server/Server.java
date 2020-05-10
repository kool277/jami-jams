package net.jami.jams.server;

import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.authentication.AuthenticationSource;
import net.jami.jams.common.cryptoengineapi.CertificateAuthority;
import net.jami.jams.common.serialization.JsoniterRegistry;
import net.jami.jams.server.core.TomcatLauncher;
import net.jami.jams.server.core.usermanagement.UserAuthenticationModule;
import net.jami.jams.server.startup.CryptoEngineLoader;
import net.jami.jams.server.startup.LibraryLoader;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
public class Server {

    public static List<String> authModuleClasses = new ArrayList<>();
    public static HashMap<String, AuthenticationSource> authenticationSources = new HashMap<>();
    public static AtomicBoolean isInstalled = new AtomicBoolean(false);

    static {
        JsoniterRegistry.initCodecs();
    }

    public static DataStore dataStore;
    //This one gets loaded via JAR, to make it more flexible.
    public static CertificateAuthority certificateAuthority;
    public static UserAuthenticationModule userAuthenticationModule;

    public static void main(String[] args){
        //Pre-load the libraries we should pre-load.
        LibraryLoader.loadlibs("libs");
        //Step 1: Create the data store.
        dataStore = new DataStore("jdbc:derby:jams;create=true");
        userAuthenticationModule = new UserAuthenticationModule();
        //Test block
        //Step 2: if the server is initialized,
        certificateAuthority = CryptoEngineLoader.loadCryptoEngine(dataStore);
        //nasty injection to test this flow.


      //Okay this is me cheating again heavily, just for testing purposes.
      try {
          InputStream path;
          ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
          path = classLoader.getResourceAsStream("ldapconfig.json");
          userAuthenticationModule.attachLDAPAuthSource(new String(path.readAllBytes()));
      }
      catch (Exception e){
          log.error("Could not load and inject active directory connector with error: " + e.toString());
      }

        //Start tomcat.
        TomcatLauncher tomcatLauncher = new TomcatLauncher();
        tomcatLauncher.startServer();
    }


}
