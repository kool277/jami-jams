package net.jami.jams.server.startup;

import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.authmodule.AuthenticationModule;
import net.jami.jams.common.cryptoengineapi.CertificateAuthority;
import net.jami.jams.common.utils.LibraryLoader;

@Slf4j
public class AuthModuleLoader {

    public static AuthenticationModule loadAuthenticationModule(DataStore dataStore, CertificateAuthority certificateAuthority) {
        try {
            Class<?> cls = LibraryLoader.classLoader.loadClass("net.jami.jams.authmodule.UserAuthenticationModule");
            AuthenticationModule authenticationModule =
                    (AuthenticationModule) cls.getConstructor(DataStore.class, CertificateAuthority.class)
                            .newInstance(dataStore, certificateAuthority);
            log.info("Loaded Authentication Module succesfully!");
            return authenticationModule;
        } catch (Exception e) {
            log.error("Unable to load Authentication Module!");
            return null;
        }
    }

}
