package net.jami.jams.common.objects.requests;

import lombok.Getter;
import lombok.Setter;
import net.jami.jams.common.objects.roots.X509Fields;

import java.security.PrivateKey;
import java.security.cert.X509Certificate;

@Getter
@Setter
public class CreateCARequest {
    private X509Fields fields;
    private X509Certificate certificate;
    private PrivateKey privateKey;
}
