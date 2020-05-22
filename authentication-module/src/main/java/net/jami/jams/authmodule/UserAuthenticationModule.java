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
package net.jami.jams.authmodule;

import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.authentication.AuthenticationSource;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.authmodule.AuthModuleKey;
import net.jami.jams.common.authmodule.AuthTokenResponse;
import net.jami.jams.common.authmodule.AuthenticationModule;
import net.jami.jams.common.cryptoengineapi.CertificateAuthority;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.jami.NameServer;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.common.utils.LibraryLoader;
import net.jami.jams.common.utils.X509Utils;

import java.io.*;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.X509Certificate;
import java.security.interfaces.RSAPublicKey;
import java.util.HashMap;
import java.util.concurrent.ConcurrentHashMap;


@Slf4j
public class UserAuthenticationModule implements AuthenticationModule {
    //This contains the DOMAIN-SOURCE.
    //In general there is at most 2 here.
    private final static String LDAP_CONNECTOR_CLASS = "net.jami.jams.ldap.connector.LDAPConnector";
    private final static String AD_CONNECTOR_CLASS = "net.jami.jams.ad.connector.ADConnector";
    public static DataStore datastore;
    public static CertificateAuthority certificateAuthority;
    private final TokenController tokenController;
    private PrivateKey privateKey = null;
    private PublicKey publicKey = null;


    private final ConcurrentHashMap<AuthModuleKey, AuthenticationSource> authenticationSources = new ConcurrentHashMap<>();

    public UserAuthenticationModule(DataStore dataStore, CertificateAuthority certificateAuthority) throws Exception{
        UserAuthenticationModule.datastore = dataStore;
        UserAuthenticationModule.certificateAuthority = certificateAuthority;
        authenticationSources.put(new AuthModuleKey("LOCAL",AuthenticationSourceType.LOCAL),datastore);
        log.info("Started authentication module - default local source is already enabled!");

        File pubkeyFile = new File(System.getProperty("user.dir") + File.separator + "oauth.pub");
        File privateKeyFile = new File(System.getProperty("user.dir") + File.separator + "oauth.key");

        if(!privateKeyFile.exists() || !pubkeyFile.exists()){
            log.info("Generating first time private/public keys for OAuth!");
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(4096);
            KeyPair kp = keyPairGenerator.generateKeyPair();
            privateKey = kp.getPrivate();
            publicKey = kp.getPublic();
            //Store these to file.
            OutputStream os;
            os = new FileOutputStream(System.getProperty("user.dir") + File.separator + "oauth.key");
            os.write(X509Utils.getPEMStringFromPrivateKey(privateKey).getBytes());
            os.flush();
            os.close();
            log.info("Succesfully stored OAuth private key for future use...");
            os = new FileOutputStream(System.getProperty("user.dir") + File.separator + "oauth.pub");
            os.write(X509Utils.getPEMStringFromPubKey(publicKey).getBytes());
            os.flush();
            os.close();
            log.info("Succesfully stored OAuth public key for future use...");
        }
        else{
            InputStream path;
            privateKey = X509Utils.getKeyFromPEMString(new String(new FileInputStream(privateKeyFile).readAllBytes()));
            log.info("Succesfully loaded OAuth private key!");
            publicKey = X509Utils.getPubKeyFromPEMString(new String(new FileInputStream(pubkeyFile).readAllBytes()));
            log.info("Succesfully loaded OAuth public key!");
        }
        //TODO: Read signing key, if file does not exist create it (also create the corresponding public key)
        tokenController = new TokenController(privateKey);
        //Also expose the public key programatically.
        log.info("OAuth2 Token System instantiated succesfully!");
    }

    @Override
    public void attachAuthSource(AuthenticationSourceType type, String settings) {
        switch (type){
            case AD: loadAuthConnector(AD_CONNECTOR_CLASS,settings); break;
            case LDAP: loadAuthConnector(LDAP_CONNECTOR_CLASS,settings); break;
            default: break;
        }
    }

    private void loadAuthConnector(String className, String settings){
        try {
            Class<?> cls = LibraryLoader.classLoader.loadClass(className);
            AuthenticationSource source = (AuthenticationSource) cls.getConstructor(String.class).newInstance(settings);
            authenticationSources.put(new AuthModuleKey(source.getInfo().getRealm(),source.getInfo().getAuthenticationSourceType()), source);
        }
        catch (Exception e){
            log.error("Could not load connector " + className + " with reason: " + e.toString());
        }
    }

    @Override
    public AuthTokenResponse authenticateUser(String username, String password) {
        AuthTokenResponse res = null;
        if(datastore.userExists(username)){
            StatementList statementList = new StatementList();
            StatementElement statementElement = new StatementElement("username","=",username,"");
            statementList.addStatement(statementElement);
            User user = datastore.getUserDao().getObjects(statementList).get(0);
            if(authenticationSources.get(new AuthModuleKey(user.getRealm(),user.getUserType()))
                    .authenticate(username,password))
                return tokenController.getToken(user);
        }
        //The second case is much more violent, because we don't know in advance "where" this user comes
        //from, so we have to infer (this is only really true for "users", all others are usually pre-marked)
        //This is also the case when we store the user into the DAO - because he never existed before.
        for(AuthModuleKey key : authenticationSources.keySet()){
            if(authenticationSources.get(key).authenticate(username,password)){
                User user = new User();
                user.setUsername(username);
                user.setAccessLevel(AccessLevel.USER);
                user.setRealm(key.getRealm());
                user.setUserType(key.getType());
                RegisterUserFlow.createUser(user,null);
                return tokenController.getToken(user);
            }
        }
        return res;
    }

    @Override
    public AuthTokenResponse authenticateUser(X509Certificate[] certificates) {
        return null;
    }

    @Override
    public ConcurrentHashMap<AuthModuleKey, AuthenticationSource> getAuthSources(){
        return authenticationSources;
    }

    @Override
    public boolean testModuleConfiguration(AuthenticationSourceType type, String settings) {
        try {
            String className = "";
            if (type.equals(AuthenticationSourceType.AD)) className = AD_CONNECTOR_CLASS;
            if (type.equals(AuthenticationSourceType.LDAP)) className = LDAP_CONNECTOR_CLASS;
            Class<?> cls = LibraryLoader.classLoader.loadClass(className);
            AuthenticationSource source = (AuthenticationSource) cls.getConstructor(String.class).newInstance(settings);
            return source.test();
        }
        catch (Exception e){
            log.error("The testing of the source was unsuccessful!");
            return false;
        }
    }

    @Override
    public boolean createUser(AuthenticationSourceType type, String realm, NameServer nameServer, User user) {
        //This concept doesn't exist for LDAP or AD or any other hosted directory, in this case we simply run
        //very theoretically, we should allow LDAP to publish to the public registry, but this is a lot
        //more complex.
        return RegisterUserFlow.createUser(user,nameServer);
    }

    @Override
    public RSAPublicKey getAuthModulePubKey() {
        return (RSAPublicKey) publicKey;
    }

}
