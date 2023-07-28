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
package net.jami.datastore.dao;

import lombok.extern.slf4j.Slf4j;

import net.jami.datastore.main.DataStore;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.objects.devices.Device;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.common.utils.X509Utils;

import org.apache.tomcat.util.codec.binary.Base64;
import org.bouncycastle.util.encoders.Hex;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;

@Slf4j
class DAOTest {

    static String strPrivateKey;
    static String strCertificate;
    static String strPkcs10Request;
    static String generatedCertificate;
    static String refreshedCertificate;

    @BeforeAll
    static void setUp() throws Exception {
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
        path = classLoader.getResourceAsStream("cert_a.crt");
        generatedCertificate = new String(path.readAllBytes());
        path = classLoader.getResourceAsStream("cert_b.crt");
        refreshedCertificate = new String(path.readAllBytes());
    }

    @Test
    void storeUser() throws Exception {
        User user = new User();
        user.setUsername("fsidokhine");
        user.setUserType(AuthenticationSourceType.LOCAL);
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        user.setSalt(Base64.encodeBase64String(salt));
        user.setPassword(hashPassword("abc123", salt));
        user.setAccessLevel(AccessLevel.ADMIN);
        user.setCertificate(X509Utils.getCertificateFromPEMString(strCertificate));
        user.setPrivateKey(X509Utils.getKeyFromPEMString(strPrivateKey));
        UserDao userDAO = new UserDao();
        userDAO.storeObject(user);

        User user1 = userDAO.getByUsername("fsidokhine").get();
        Assertions.assertNotNull(user1);
        Assertions.assertEquals(user1.getAccessLevel(), AccessLevel.ADMIN);
    }

    @Test
    void refreshUserCertificate() throws Exception {
        User user = new User();
        user.setUsername("TestUser");
        user.setUserType(AuthenticationSourceType.LOCAL);
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        user.setSalt(Base64.encodeBase64String(salt));
        user.setPassword(hashPassword("abc123", salt));
        user.setAccessLevel(AccessLevel.USER);
        user.setCertificate(X509Utils.getCertificateFromPEMString(generatedCertificate));

        UserDao userDAO = new UserDao();
        userDAO.storeObject(user);

        User user1 = userDAO.getByUsername("TestUser").get();
        Assertions.assertNotNull(user1);
        Assertions.assertEquals(user1.getAccessLevel(), AccessLevel.USER);

        userDAO.updateUserCertificate(
                "TestUser",
                X509Utils.getPEMStringFromCertificate(
                        X509Utils.getCertificateFromPEMString(refreshedCertificate)));

        User user2 = userDAO.getByUsername("TestUser").get();
        Assertions.assertNotEquals(user1.getCertificate(), user2.getCertificate());
    }

    @Test
    void storeDevice() {
        Device device = new Device();
        device.setDeviceId("01929833");
        device.setOwner("fsidokhine");
        device.setCertificate(X509Utils.getCertificateFromPEMString(strCertificate));
        device.setPrivateKey(X509Utils.getKeyFromPEMString(strPrivateKey));
        DeviceDao deviceDAO = new DeviceDao();
        deviceDAO.storeObject(device);

        Device device1 = deviceDAO.getByOwner("fsidokhine").get(0);
        Assertions.assertNotNull(device1);
    }

    @Test
    void storeAdminUser() throws Exception {
        User user = new User();
        user.setUsername("admin");
        user.setUserType(AuthenticationSourceType.LOCAL);
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        user.setSalt(Base64.encodeBase64String(salt));
        user.setPassword(hashPassword("abc123", salt));
        user.setAccessLevel(AccessLevel.ADMIN);
        UserDao userDAO = new UserDao();
        userDAO.storeObject(user);

        User user1 = userDAO.getByUsername("admin").get();
        Assertions.assertNotNull(user1);
        Assertions.assertEquals(user1.getAccessLevel(), AccessLevel.ADMIN);
    }

    public static String hashPassword(String password, byte[] salt) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            digest.update(salt);
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return new String(Hex.encode(hash));
        } catch (Exception e) {
            return null;
        }
    }
}
