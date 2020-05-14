package net.jami.jams.ca.workers.crl;

import lombok.Getter;
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
import java.util.concurrent.atomic.AtomicReference;

@Slf4j
public class CRLWorker extends X509Worker<RevocationRequest> {

    @Getter
    private AtomicReference<X509CRLHolder> existingCRL = null;

    public CRLWorker(PrivateKey privateKey, X509Certificate certificate) {
        super(privateKey, certificate);
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
        while(true){
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
    }
}
