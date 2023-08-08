package tests;

import net.jami.datastore.main.DataStore;
import net.jami.jams.common.dao.connectivity.SQLConnection;
import net.jami.jams.common.objects.user.UserProfile;
import net.jami.jams.ldap.connector.LDAPConnector;

import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.zapodot.junit.ldap.EmbeddedLdapRule;
import org.zapodot.junit.ldap.EmbeddedLdapRuleBuilder;

import java.io.InputStream;
import java.util.List;
import java.util.Optional;

public class GenericLDAPTest {

    private static LDAPConnector ldapConnector = null;

    private void initLdapConnector() throws Exception {
        if (ldapConnector == null) {
            InputStream inputStream =
                    GenericLDAPTest.class.getClassLoader().getResourceAsStream("ldapconfig.json");
            ldapConnector = new LDAPConnector(new String(inputStream.readAllBytes()));
        }
    }

    @BeforeEach
    private void setUp() throws Exception {
        initLdapConnector();
        DataStore dataStore = new DataStore("jdbc:derby:memory:testdb;create=true");
        SQLConnection connection = DataStore.connectionPool.getConnection();
        Assertions.assertNotNull(connection);
    }

    @Rule
    public EmbeddedLdapRule server =
            EmbeddedLdapRuleBuilder.newInstance()
                    .usingDomainDsn("dc=savoirfairelinux,dc=net")
                    .bindingToPort(1089)
                    .importingLdifs("bootstrap.ldif")
                    .build();

    @Disabled
    @Test
    public void testLookUp() throws Exception {
        initLdapConnector();
        List<UserProfile> profiles =
                ldapConnector.searchUserProfiles("*", "FULL_TEXT_NAME", Optional.empty());
        Assertions.assertEquals(2, profiles.size());
        Assertions.assertNotNull(profiles.get(0).getFirstName());
        Assertions.assertNotNull(profiles.get(1).getFirstName());
    }

    @Test
    public void testAuth() throws Exception {
        boolean res;
        initLdapConnector();
        res = ldapConnector.authenticate("fsidokhine", "password");
        Assertions.assertTrue(res);
        res = ldapConnector.authenticate("fsidokhine", "badpassword");
        Assertions.assertFalse(res);
    }

    @Disabled
    @Test
    public void getVcard() throws Exception {
        initLdapConnector();
        List<UserProfile> profiles =
                ldapConnector.searchUserProfiles("Felix", "FULL_TEXT_NAME", Optional.empty());
        Assert.assertEquals(1, profiles.size());
        Assert.assertNotNull(profiles.get(0).getUsername());
        String vcard = profiles.get(0).getAsVCard();
        Assert.assertNotNull(vcard);
    }
}
