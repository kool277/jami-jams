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
package net.jami.jams.ca.workers.crl;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.ca.JamsCA;
import net.jami.jams.ca.workers.X509Worker;
import net.jami.jams.common.objects.requests.RevocationRequest;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x509.CRLReason;
import org.bouncycastle.cert.X509CRLHolder;
import org.bouncycastle.cert.X509v2CRLBuilder;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;

import java.security.PrivateKey;
import java.security.cert.X509Certificate;
import java.util.Date;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

@Slf4j
public class CRLWorker extends X509Worker<RevocationRequest> {

    @Getter
    private AtomicReference<X509CRLHolder> existingCRL = null;

    @Getter @Setter
    private AtomicBoolean stop = new AtomicBoolean(false);

    public CRLWorker(PrivateKey privateKey, X509Certificate certificate) {
        super(privateKey, certificate);
        if(privateKey == null || certificate == null) return;
        this.setDaemon(true);
        this.start();
        //TODO: The CRL needs to be loaded from memory
        log.info("Instantiated & started a CRL Worker...");
    }

    //Basically we just publish it in the CRL.
    private void revokeCertificate(RevocationRequest revocationRequest){
        try {
            X509v2CRLBuilder crlBuilder = new X509v2CRLBuilder(new X500Name((getCertificate()).getSubjectDN().getName()), new Date());
            if(revocationRequest != null) {
                crlBuilder.addCRLEntry(revocationRequest.getIdentifier(), new Date(), CRLReason.privilegeWithdrawn);
            }
            if (existingCRL != null){
                crlBuilder.addCRL(existingCRL.get());
            }
            else existingCRL = new AtomicReference<>();
            existingCRL.set(crlBuilder.build(new JcaContentSignerBuilder("SHA512WITHRSA").setProvider("BC").build(getSigningKey())));
            log.info("Successfully ran revocation routine");
        }
        catch (Exception e){
            log.error("Failed to sign a CRL with error " + e.toString());
        }
    }

    @Override
    public void run() {
        boolean needsRefresh = false;
        while(!stop.get()){
            try{
                while(getInput().isEmpty()){
                    if(needsRefresh){
                        revokeCertificate(null);
                        needsRefresh = false;
                    }
                    synchronized (getInput()){
                        getInput().wait(JamsCA.crlLifetime - 10_000);
                        needsRefresh = true;
                    }
                }
                while(!getInput().isEmpty()) {
                    RevocationRequest revocationRequest = getInput().poll();
                    revokeCertificate(revocationRequest);
                    needsRefresh = false;
                    log.info("Successfully revoked the certificated with ID " + revocationRequest.getIdentifier());
                }
            }
            catch (Exception e){
                log.error("An error has occured in the CRL signing thread: " + e.toString());
            }
        }
        log.info("Stopped CRL Worker Thread...");
    }
}
