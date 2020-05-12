package net.jami.jams.common.objects.roots;

import lombok.Getter;
import lombok.Setter;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;

import java.security.PrivateKey;
import java.security.cert.X509Certificate;

@Getter
@Setter
public class X509Entity {
    private X509Certificate certificate;
    private PrivateKey privateKey;
    //These can be null because they are only used if this is a request.
    private X509Fields x509Fields;
    private PKCS10CertificationRequest certificationRequest;
    private Long lifetime;
}
