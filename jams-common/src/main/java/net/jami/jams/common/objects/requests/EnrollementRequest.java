package net.jami.jams.common.objects.requests;

import lombok.Getter;
import lombok.Setter;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;

@Getter
@Setter
public class EnrollementRequest {

    private PKCS10CertificationRequest csr;

}
