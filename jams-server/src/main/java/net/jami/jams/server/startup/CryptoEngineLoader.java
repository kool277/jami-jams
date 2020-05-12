package net.jami.jams.server.startup;

import lombok.extern.slf4j.Slf4j;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.cryptoengineapi.CertificateAuthority;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.system.SystemAccount;

import java.util.List;

@Slf4j
public class CryptoEngineLoader {

    public static CertificateAuthority loadCertificateAuthority(DataStore dataStore){
        try {
            Class<?> cls = LibraryLoader.classLoader.loadClass("net.jami.jams.ca.JamsCA");
            CertificateAuthority certificateAuthority = (CertificateAuthority) cls.getConstructor().newInstance();
            StatementList statementList = new StatementList();
            statementList.addStatement(new StatementElement("entity","=","CA",""));
            List<SystemAccount> accounts = dataStore.getSystemDao().getObjects(statementList);
            if(accounts.size() == 0){
                log.info("This is an fresh install, and it has no CA or any system accounts - if there is a config.json" +
                        " file in your directory, this means the install is broken and you should delete and restart!");
            }
            else{
                statementList = new StatementList();
                statementList.addStatement(new StatementElement("entity","=","CA",""));
                SystemAccount caAccount = dataStore.getSystemDao().getObjects(statementList).get(0);
                statementList = new StatementList();
                statementList.addStatement(new StatementElement("entity","=","OCSP",""));
                SystemAccount ocspAccount = dataStore.getSystemDao().getObjects(statementList).get(0);
                log.info("Injecting OCSP and CA acocunts...");
                certificateAuthority.init("domain.com","SHA512WITHRSA",caAccount,ocspAccount);
            }
            log.info("Loaded X509 Engine - please make sure it is initialized before using it to sign requests!");
            return certificateAuthority;
        }
        catch (Exception e){
            log.error("Unable to load X509 Engine!");
            return null;
        }
    }

}
