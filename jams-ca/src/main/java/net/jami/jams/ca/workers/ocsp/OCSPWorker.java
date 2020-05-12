package net.jami.jams.ca.workers.ocsp;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.ca.workers.X509Worker;

import java.security.PrivateKey;
import java.security.cert.X509Certificate;

@Slf4j
public class OCSPWorker extends X509Worker<String> {

    public OCSPWorker(PrivateKey privateKey, X509Certificate certificate) {
        super(privateKey, certificate);
        log.info("Instantiated OCSP Worker...");
    }
}
