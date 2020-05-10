package net.jami.datastore.dao;

import net.jami.datastore.main.DataStore;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.devices.Device;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.common.utils.X509Utils;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.InputStream;

class DAOTest {

    static String strPrivateKey;
    static String strCertificate;
    static String strPkcs10Request;

    @BeforeAll
    static void setUp() throws Exception{
        DataStore dataStore = new DataStore("jdbc:derby:testdb;create=true");
        Assertions.assertNotNull(DataStore.connectionPool.getConnection());
        InputStream path;
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        path = classLoader.getResourceAsStream("cakey.txt");
        strPrivateKey = new String(path.readAllBytes());
        path = classLoader.getResourceAsStream("cacert.txt");
        strCertificate = new String(path.readAllBytes());
        path = classLoader.getResourceAsStream("pkcs10request.txt");
        strPkcs10Request = new String(path.readAllBytes());
    }

    @Test
    void storeUser(){
        User user = new User();
        user.setUsername("fsidokhine");
        user.setUserType(AuthenticationSourceType.LOCAL);
        user.setPassword("abc123");
        user.setAccessLevel(AccessLevel.ADMIN);
        user.setCertificate(X509Utils.getCertificateFromPEMString(strCertificate));
        user.setPrivateKey(X509Utils.getKeyFromPEMString(strPrivateKey));
        UserDao userDAO = new UserDao();
        userDAO.storeObject(user);

        StatementList statementList = new StatementList();
        statementList.addStatement(new StatementElement("username","=","fsidokhine",""));
        User user1 = userDAO.getObjects(statementList).get(0);
        Assertions.assertNotNull(user1);
        Assertions.assertEquals(user1.getAccessLevel(),AccessLevel.ADMIN);
    }

    @Test
    void storeDevice(){
        Device device = new Device();
        device.setDeviceId("01929833");
        device.setOwner("fsidokhine");
        device.setCertificate(X509Utils.getCertificateFromPEMString(strCertificate));
        device.setPrivateKey(X509Utils.getKeyFromPEMString(strPrivateKey));
        DeviceDao deviceDAO = new DeviceDao();
        deviceDAO.storeObject(device);

        StatementList statementList = new StatementList();
        statementList.addStatement(new StatementElement("owner","=","fsidokhine",""));
        Device device1 = deviceDAO.getObjects(statementList).get(0);
        Assertions.assertNotNull(device1);
    }

    @Test
    void storeAdminUser(){
        User user = new User();
        user.setUsername("admin");
        user.setUserType(AuthenticationSourceType.LOCAL);
        user.setPassword("abc123");
        user.setAccessLevel(AccessLevel.ADMIN);
        UserDao userDAO = new UserDao();
        userDAO.storeObject(user);

        StatementList statementList = new StatementList();
        statementList.addStatement(new StatementElement("username","=","admin",""));
        User user1 = userDAO.getObjects(statementList).get(0);
        Assertions.assertNotNull(user1);
        Assertions.assertEquals(user1.getAccessLevel(),AccessLevel.ADMIN);
    }





}