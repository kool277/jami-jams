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

import static net.jami.jams.ca.workers.csr.CertificateWorker.SHIFT;

import lombok.extern.slf4j.Slf4j;

import net.jami.jams.ca.JamsCA;
import net.jami.jams.ca.workers.csr.utils.CertificateSigner;
import net.jami.jams.ca.workers.csr.utils.ExtensionLibrary;
import net.jami.jams.common.objects.roots.X509Fields;
import net.jami.jams.common.objects.user.User;

import org.apache.commons.codec.binary.Hex;
import org.apache.commons.codec.digest.MessageDigestAlgorithms;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;
import org.bouncycastle.cert.X509v3CertificateBuilder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;

import java.math.BigInteger;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Date;

@Slf4j
public class UserBuilder {

    public static User generateUser(User user) {
        try {
            long now = System.currentTimeMillis();
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(4096);
            KeyPair keyPair = keyPairGenerator.generateKeyPair();

            user.getX509Fields()
                    .setUid(
                            Hex.encodeHexString(
                                    MessageDigest.getInstance(MessageDigestAlgorithms.SHA_1)
                                            .digest(keyPair.getPublic().getEncoded())));

            X509v3CertificateBuilder builder =
                    new X509v3CertificateBuilder(
                            new JcaX509CertificateHolder(JamsCA.CA.getCertificate()).getSubject(),
                            new BigInteger(128, new SecureRandom()),
                            new Date(now - SHIFT),
                            new Date(now + JamsCA.userLifetime),
                            new X500Name(user.getX509Fields().getDN()),
                            SubjectPublicKeyInfo.getInstance(keyPair.getPublic().getEncoded()));

            user.setPrivateKey(keyPair.getPrivate());
            user.setCertificate(
                    CertificateSigner.signCertificate(
                            JamsCA.CA.getPrivateKey(), builder, ExtensionLibrary.userExtensions));
            log.info(
                    "New user certificate:  Not valid after: "
                            + user.getCertificate().getNotAfter());
            return user;
        } catch (Exception e) {
            log.error("Could not generate a user certificate: " + e);
            return null;
        }
    }

    public static User refreshUser(User user) {
        return refreshUser(user, JamsCA.userLifetime);
    }

    public static User refreshUser(User user, long userLifeTime) {
        try {
            long now = System.currentTimeMillis();

            user.setX509Fields(new X509Fields());
            user.getX509Fields().setCommonName(user.getUsername());
            user.getX509Fields().setUid(user.getJamiId());

            X509v3CertificateBuilder builder =
                    new X509v3CertificateBuilder(
                            new JcaX509CertificateHolder(JamsCA.CA.getCertificate()).getSubject(),
                            new BigInteger(128, new SecureRandom()),
                            new Date(now - SHIFT),
                            new Date(now + userLifeTime),
                            new X500Name(user.getX509Fields().getDN()),
                            new JcaX509CertificateHolder(user.getCertificate())
                                    .getSubjectPublicKeyInfo());
            user.setCertificate(
                    CertificateSigner.signCertificate(
                            JamsCA.CA.getPrivateKey(), builder, ExtensionLibrary.userExtensions));
            log.info(
                    "Refreshed user certificate:  Not valid after: "
                            + user.getCertificate().getNotAfter());

            return user;
        } catch (Exception e) {
            log.error("Could not refresh user certificate: " + e);
            return null;
        }
    }
}
