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

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.ca.JamsCA;
import net.jami.jams.ca.workers.csr.utils.CertificateSigner;
import net.jami.jams.ca.workers.csr.utils.ExtensionLibrary;
import net.jami.jams.common.objects.devices.Device;
import net.jami.jams.common.objects.user.User;
import org.bouncycastle.asn1.ASN1ObjectIdentifier;
import org.bouncycastle.asn1.x509.GeneralName;
import org.bouncycastle.cert.X509v3CertificateBuilder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.Date;

import org.bouncycastle.asn1.x509.GeneralName;
import org.bouncycastle.asn1.x509.AccessDescription;
import org.bouncycastle.asn1.x509.AuthorityInformationAccess;
import org.bouncycastle.asn1.x509.Extension;

import static net.jami.jams.ca.workers.csr.CertificateWorker.SHIFT;

@Slf4j
public class DeviceBuilder {

    private static final ASN1ObjectIdentifier DEVICE_ID_FIELD = new ASN1ObjectIdentifier("0.9.2342.19200300.100.1.1");
    private static final ASN1ObjectIdentifier DEVICE_CN = new ASN1ObjectIdentifier("2.5.4.3");

    public static Device generateDevice(User user, Device device){
        try {
            X509v3CertificateBuilder builder = new X509v3CertificateBuilder(
                    new JcaX509CertificateHolder(user.getCertificate()).getSubject(),
                    new BigInteger(256, new SecureRandom()),
                    new Date(System.currentTimeMillis() - SHIFT),
                    new Date(System.currentTimeMillis() + JamsCA.deviceLifetime),
                    device.getCertificationRequest().getSubject(),
                    device.getCertificationRequest().getSubjectPublicKeyInfo()
            );

            /*
            *
            * This extension library configuration is done at this point in order to add the issuer id (here the jami Id)
            * to the certificate to help retrieve the device certificate issuer in more suitable manner during the call to the OCSP endpoint
            *
            * */

            //Pre-Define the AIA Point
            AccessDescription accessDescription = new AccessDescription(
                    AccessDescription.id_ad_ocsp,
                    new GeneralName(GeneralName.uniformResourceIdentifier, JamsCA.serverDomain + "/api/ocsp/"  + user.getJamiId())
            );

            ExtensionLibrary.deviceExtensions.getExtensions().set(3, new Object[]{Extension.authorityInfoAccess, false, new AuthorityInformationAccess(accessDescription)});

            device.setCertificate(CertificateSigner.signCertificate(user.getPrivateKey(),builder, ExtensionLibrary.deviceExtensions));
            boolean deviceIdDetected = false;
            for(int i=0; i < device.getCertificationRequest().getSubject().getRDNs().length;i++) {
                if(device.getCertificationRequest().getSubject().getRDNs()[i].getFirst().getType().equals(DEVICE_ID_FIELD)){
                    device.setDeviceId(device.getCertificationRequest().getSubject().getRDNs()[i].getFirst().getValue().toString());
                    deviceIdDetected = true;
                }
            }
            if(!deviceIdDetected) return null;
            //kill off the certification request it's useless.
            device.setCertificationRequest(null);
            return device;
        }
        catch (Exception e){
            log.error("Could not generate a user certificate: " + e.toString());
            return null;
        }
    }


}
