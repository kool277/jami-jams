package net.jami.jams.common.objects.requests;

import lombok.Getter;
import lombok.Setter;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;

@Getter
@Setter
public class DeviceRegistrationRequest {

    private PKCS10CertificationRequest csr;
    private String deviceName;

}
