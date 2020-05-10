package net.jami.jams.cryptoengine.workers;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.security.PrivateKey;
import java.security.cert.X509Certificate;
import java.util.concurrent.ConcurrentLinkedQueue;

@Getter
@Setter
@Slf4j
public abstract class X509Worker<T> extends Thread{

    private ConcurrentLinkedQueue<T> input = new ConcurrentLinkedQueue<>();
    private PrivateKey signingKey;
    private X509Certificate certificate;

    public X509Worker(PrivateKey privateKey, X509Certificate certificate) {
        this.signingKey = privateKey;
        this.certificate = certificate;
    }
}
