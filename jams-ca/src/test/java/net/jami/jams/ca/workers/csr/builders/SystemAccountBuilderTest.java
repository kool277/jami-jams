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
package net.jami.jams.ca.workers.csr.builders;

import static org.junit.jupiter.api.Assertions.fail;

import com.jsoniter.output.JsonStream;

import net.jami.jams.ca.JamsCA;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.cryptoengineapi.CertificateAuthorityConfig;
import net.jami.jams.common.objects.devices.Device;
import net.jami.jams.common.objects.requests.RevocationRequest;
import net.jami.jams.common.objects.requests.RevocationType;
import net.jami.jams.common.objects.roots.X509Fields;
import net.jami.jams.common.objects.system.SystemAccount;
import net.jami.jams.common.objects.system.SystemAccountType;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.common.utils.X509Utils;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.InputStream;
import java.math.BigInteger;
import java.util.HashMap;

class SystemAccountBuilderTest {

    private static String strPkcs10Request;

    @BeforeAll
    static void setUp() throws Exception {
        // Delete the jams.crl file if it exists.
        File file = new File(System.getProperty("user.dir") + File.separator + "jams.crl");
        file.delete();
        InputStream path;
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        path = classLoader.getResourceAsStream("pkcs10request.txt");
        strPkcs10Request = new String(path.readAllBytes());
    }

    @Test
    void generateFullChain() {
        SystemAccount caAccount = new SystemAccount();
        caAccount.setSystemAccountType(SystemAccountType.CA);
        caAccount.setX509Fields(new X509Fields());
        caAccount.getX509Fields().setCommonName("Test CA");
        caAccount.getX509Fields().setCountry("FR");
        caAccount.getX509Fields().setLifetime(10000000L);
        caAccount = SystemAccountBuilder.generateCA(caAccount);
        Assertions.assertNotNull(caAccount.getCertificate(), "CA Certificate was not generated!");

        JamsCA.CA = caAccount;

        // Generate OCSP
        SystemAccount ocspAccount = new SystemAccount();
        ocspAccount.setSystemAccountType(SystemAccountType.OCSP);
        ocspAccount.setX509Fields(new X509Fields());
        ocspAccount.getX509Fields().setCommonName("OCSP Server");
        ocspAccount.getX509Fields().setLifetime(10000000L);
        ocspAccount = SystemAccountBuilder.generateOCSP(ocspAccount);
        Assertions.assertNotNull(
                ocspAccount.getCertificate(), "OCSP Certificate was not generated!");

        // Generate User.
        User user = new User();
        user.setUserType(AuthenticationSourceType.LOCAL);
        user.setX509Fields(new X509Fields());
        user.getX509Fields().setCommonName("Felix's Personal Certificate");
        user = UserBuilder.generateUser(user);
        Assertions.assertNotNull(user.getCertificate(), "User Certificate was not generated!");

        // Generate a device
        Device device = new Device();
        device.setOwner("00000");
        device.setCertificationRequest(X509Utils.getCSRFromString(strPkcs10Request));
        device = DeviceBuilder.generateDevice(user, device);
        Assertions.assertNotNull(device.getCertificate(), "Device certificate was not generated!");
        // Check that we can decode the rdn.
        try {
            HashMap<String, String> data =
                    X509Utils.extractDNFromCertificate(device.getCertificate());
            Assertions.assertEquals(2, data.size());
        } catch (Exception e) {
            fail();
        }
    }

    @Test
    void testCRLGeneration() throws Exception {
        SystemAccount caAccount = new SystemAccount();
        caAccount.setSystemAccountType(SystemAccountType.CA);
        caAccount.setX509Fields(new X509Fields());
        caAccount.getX509Fields().setCommonName("Test CA");
        caAccount.getX509Fields().setCountry("FR");
        caAccount.getX509Fields().setLifetime(10000000L);
        caAccount = SystemAccountBuilder.generateCA(caAccount);
        Assertions.assertNotNull(caAccount.getCertificate(), "CA Certificate was not generated!");
        CertificateAuthorityConfig config = new CertificateAuthorityConfig();
        config.setUserLifetime(1000L);
        config.setSigningAlgorithm("SHA512WITHRSA");
        config.setServerDomain("http://localhost");
        config.setCrlLifetime(1000000L);
        config.setDeviceLifetime(1000L);

        JamsCA jamsCA = new JamsCA();
        jamsCA.init(JsonStream.serialize(config), caAccount, caAccount);
        RevocationRequest revocationRequest = new RevocationRequest();
        revocationRequest.setIdentifier(new BigInteger("91828882"));
        revocationRequest.setRevocationType(RevocationType.USER);
        jamsCA.revokeCertificate(revocationRequest);
        synchronized (this) {
            this.wait(2_000);
        }
        Assertions.assertNotNull(jamsCA.getLatestCRL());
        Assertions.assertEquals(
                1,
                jamsCA.getLatestCRL().get().getRevokedCertificates().toArray().length,
                "Expected only 1 certificate!");

        revocationRequest = new RevocationRequest();
        revocationRequest.setIdentifier(new BigInteger("17262653"));
        revocationRequest.setRevocationType(RevocationType.USER);
        jamsCA.revokeCertificate(revocationRequest);
        synchronized (this) {
            this.wait(2_000);
        }
        Assertions.assertNotNull(jamsCA.getLatestCRL());
        Assertions.assertEquals(
                2,
                jamsCA.getLatestCRL().get().getRevokedCertificates().toArray().length,
                "Expected only 2 certificates!");
    }

    @AfterAll
    static void afterAll() {
        File file = new File(System.getProperty("user.dir") + File.separator + "jams.crl");
        file.delete();
    }
}
