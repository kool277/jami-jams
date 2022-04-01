package net.jami.jams.ca.workers.csr.builders;

import net.jami.jams.ca.JamsCA;
import lombok.extern.slf4j.Slf4j;

import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.objects.roots.X509Fields;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.common.utils.X509Utils;
import org.bouncycastle.openssl.jcajce.JcaPEMWriter;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;
import java.util.Arrays;
import java.util.Base64;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Assertions;

import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;

@Slf4j
class UserBuilderTest {


    @Test
    void generateUserCertificate() {

        User user = new User();
        user.setUsername("TestUser");
        user.setUserType(AuthenticationSourceType.LOCAL);
        user.setX509Fields(new X509Fields());
        user.getX509Fields().setCommonName("TestUser's Personal Certificate");
        user = UserBuilder.generateUser(user);

        Assertions.assertNotNull(user.getCertificate(),"User Certificate was not generated!");
    }

    @Test
    void refreshUserCertificate() {

        User user = new User();
        user.setUsername("TestUser");
        //user.setJamiId("");
        user.setUserType(AuthenticationSourceType.LOCAL);
        user.setX509Fields(new X509Fields());
        user.getX509Fields().setCommonName("TestUser's Personal Certificate");
        user = UserBuilder.generateUser(user);

        Assertions.assertNotNull(user,"User was not generated!");

        X509Certificate cert = user.getCertificate();
        Assertions.assertNotNull(cert,"User Certificate was not generated!");

        User refreshedUser = UserBuilder.refreshUser(user, 465_000_000);
        Assertions.assertNotNull(refreshedUser,"User was not generated!");
        X509Certificate new_cert = refreshedUser.getCertificate();

        Assertions.assertArrayEquals(cert.getPublicKey().getEncoded(), new_cert.getPublicKey().getEncoded(), "PK is different");

        Assertions.assertNotNull(new_cert,"User Certificate was not updated!");
        Assertions.assertEquals(user.getAddress(), refreshedUser.getAddress(), "User address is different");

        Assertions.assertNotEquals(cert.getNotAfter(), new_cert.getNotAfter());
        try {
            Assertions.assertEquals(new JcaX509CertificateHolder(cert).getSubjectPublicKeyInfo().getPublicKey(),
                    new JcaX509CertificateHolder(new_cert).getSubjectPublicKeyInfo().getPublicKey());
        } catch (Exception e) {
            log.error("Error comparing two public keys information: ", e.getMessage());
        }
    }
}