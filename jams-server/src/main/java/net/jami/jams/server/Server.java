package net.jami.jams.server;

import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.ca.JamsCA;
import net.jami.jams.ca.workers.csr.builders.SystemAccountBuilder;
import net.jami.jams.common.authentication.AuthenticationSource;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.authmodule.AuthenticationModule;
import net.jami.jams.common.cryptoengineapi.CertificateAuthority;
import net.jami.jams.common.objects.roots.X509Fields;
import net.jami.jams.common.objects.system.SystemAccount;
import net.jami.jams.common.objects.system.SystemAccountType;
import net.jami.jams.common.objects.user.UserProfile;
import net.jami.jams.common.serialization.JsoniterRegistry;
import net.jami.jams.server.core.TomcatLauncher;
import net.jami.jams.common.authmodule.AuthModuleKey;
import net.jami.jams.server.startup.AuthModuleLoader;
import net.jami.jams.server.startup.CryptoEngineLoader;
import net.jami.jams.common.utils.LibraryLoader;

import java.io.File;
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
    public static AuthenticationModule userAuthenticationModule;

    public static void main(String[] args) {
        //Start tomcat.
        TomcatLauncher tomcatLauncher = new TomcatLauncher();
        tomcatLauncher.startServer();

        //Pre-load the libraries we should pre-load.
        LibraryLoader.loadlibs("libs",Server.class);
        //Step 1: Create the data store.
        dataStore = new DataStore("jdbc:derby:jams;create=true");

        //Test block
        //Step 2: if the server is initialized,
        certificateAuthority = CryptoEngineLoader.loadCertificateAuthority(dataStore);
        userAuthenticationModule = AuthModuleLoader.loadAuthenticationModule(dataStore,certificateAuthority);

        isInstalled.set(new File(System.getProperty("user.dir") + File.separator + "config.json").exists());
        log.info("Server is already installed: " + isInstalled.get());

        //nasty injection to test this flow.
        //Okay this is me cheating again heavily, just for testing purposes.
        try {
            JamsCA.serverDomain = "https://localhost";
            JamsCA.signingAlgorithm = "SHA512WITHRSA";
            SystemAccount caAccount = new SystemAccount();
            caAccount.setSystemAccountType(SystemAccountType.CA);
            caAccount.setX509Fields(new X509Fields());
            caAccount.getX509Fields().setCommonName("Test CA");
            caAccount.getX509Fields().setCountry("FR");
            caAccount = SystemAccountBuilder.generateCA(caAccount);
            JamsCA.CA = caAccount;


            InputStream path;
            ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
            path = classLoader.getResourceAsStream("ldapconfig.json");
            userAuthenticationModule.attachAuthSource(AuthenticationSourceType.LDAP,new String(path.readAllBytes()));
            UserProfile[] userProfile = userAuthenticationModule.getAuthSources()
                    .get(new AuthModuleKey("savoirfairelinux", AuthenticationSourceType.LDAP))
                    .getUserProfile("Félix","FULL_TEXT_NAME");
            System.out.println(userProfile[0]);
        } catch (Exception e) {
            log.error("Could not load and inject active directory connector with error: " + e.toString());
        }
    }
}
