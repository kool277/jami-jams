package net.jami.jams.server.core.workflows;

import com.jsoniter.output.JsonStream;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.objects.roots.X509Fields;
import net.jami.jams.common.objects.system.SystemAccount;
import net.jami.jams.common.objects.system.SystemAccountType;
import net.jami.jams.common.server.ServerSettings;
import net.jami.jams.nameserver.LocalNameServer;
import net.jami.jams.nameserver.PublicNameServer;
import net.jami.jams.server.Server;
import net.jami.jams.server.servlets.api.install.CachedObjects;
import net.jami.jams.server.startup.AuthModuleLoader;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

import static net.jami.jams.server.Server.*;

@Slf4j
public class InstallationFinalizer {

    public boolean finalizeInstallation() {
        //Basically here we build the config and flush it.
        try {
            log.info("Building configuration from submitted variables...");
            ServerSettings serverSettings = new ServerSettings();
            serverSettings.setCaConfiguration(JsonStream.serialize(CachedObjects.certificateAuthorityConfig));
            //TODO: This is a bit of hack, we should fix this someday.
            serverSettings.setServerPublicURI(CachedObjects.certificateAuthorityConfig.getServerDomain());
            if (CachedObjects.activeDirectorySettings != null) {
                serverSettings.setActiveDirectoryConfiguration(JsonStream.serialize(CachedObjects.activeDirectorySettings));
                nameServer = new LocalNameServer(dataStore,userAuthenticationModule,serverSettings.getServerPublicURI());
                log.info("Server configured to use Active Directory as the authentication backend!");
            }
            if (CachedObjects.ldapSettings != null) {
                serverSettings.setLdapConfiguration(JsonStream.serialize(CachedObjects.ldapSettings));
                nameServer = new LocalNameServer(dataStore,userAuthenticationModule,serverSettings.getServerPublicURI());
                log.info("Server configured to use LDAP as the authentication backend!");
            }
            if (CachedObjects.localAuthSettings != null) {
                serverSettings.setLocalDirectoryConfiguration(JsonStream.serialize(CachedObjects.localAuthSettings));
                if(CachedObjects.localAuthSettings.getPublicNames()){
                    nameServer = new PublicNameServer(CachedObjects.localAuthSettings.getPublicNameServer());
                    log.warn("Server configured to use {} as the nameserver for Jami clients !",CachedObjects.localAuthSettings.getPublicNameServer());
                }
                else nameServer = new LocalNameServer(dataStore,userAuthenticationModule,serverSettings.getServerPublicURI());
                log.info("Server is configured to use local authentication engine");
            }
            //Now flush the server settings.
            OutputStream os = new FileOutputStream(new File("config.json"));
            os.write(JsonStream.serialize(serverSettings).getBytes());
            os.flush();
            os.close();
            log.info("Settings succesfully saved to configuration file...");
            log.info("Attempting to save the CA and generate the OCSP certificate...");
            if (CachedObjects.createCARequest.getFields() != null) {
                SystemAccount caAccount = new SystemAccount();
                caAccount.setSystemAccountType(SystemAccountType.CA);
                caAccount.setX509Fields(CachedObjects.createCARequest.getFields());
                certificateAuthority.getSignedCertificate(caAccount);
                dataStore.getSystemDao().storeObject(caAccount);
                log.info("Succesfully stored CA");
                certificateAuthority.init(serverSettings.getCaConfiguration(), caAccount, null);
                SystemAccount ocspAccount = new SystemAccount();
                ocspAccount.setX509Fields(new X509Fields());
                ocspAccount.getX509Fields().setCommonName("OCSP Server Certificate");
                ocspAccount.setSystemAccountType(SystemAccountType.OCSP);
                ocspAccount.getX509Fields().setLifetime(caAccount.getX509Fields().getLifetime());
                certificateAuthority.getSignedCertificate(ocspAccount);
                dataStore.getSystemDao().storeObject(ocspAccount);
                log.info("Successfully created and stored the OCSP certificate");
                certificateAuthority.init(serverSettings.getCaConfiguration(), caAccount, ocspAccount);
                log.info("Succesfully inited the certificate authority with the appropriate settings...");
            }
            log.info("Initializing the selected authentication providers");
            userAuthenticationModule = AuthModuleLoader.loadAuthenticationModule(dataStore, certificateAuthority);
            if(serverSettings.getActiveDirectoryConfiguration() != null)
                userAuthenticationModule.attachAuthSource(AuthenticationSourceType.AD,serverSettings.getActiveDirectoryConfiguration());
            if(serverSettings.getLdapConfiguration() != null)
                userAuthenticationModule.attachAuthSource(AuthenticationSourceType.LDAP,serverSettings.getLdapConfiguration());
            Server.isInstalled.set(true);
            log.info("The installation has completed successfully, you can now use JAMS!");
        } catch (Exception e) {
            log.error("Could not save settings to disk with error: " + e.toString());
            return false;
        }
        return true;
    }


}
