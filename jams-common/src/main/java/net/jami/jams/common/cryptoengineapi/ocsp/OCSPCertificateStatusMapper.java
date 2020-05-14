package net.jami.jams.common.cryptoengineapi.ocsp;

import org.bouncycastle.cert.ocsp.CertificateStatus;
import org.bouncycastle.cert.ocsp.RevokedStatus;
import org.bouncycastle.cert.ocsp.UnknownStatus;

import java.time.ZoneId;
import java.util.Date;

import static net.jami.jams.common.cryptoengineapi.ocsp.RevocationReason.PRIVILEGE_WITHDRAWN;
import static net.jami.jams.common.cryptoengineapi.ocsp.RevocationReason.SUPERSEDED;

public class OCSPCertificateStatusMapper {

    public static CertificateStatus getStatus(CertificateSummary certificateSummary){
        switch (certificateSummary.getStatus()) {
            case VALID:
                return CertificateStatus.GOOD;
            case REVOKED:
                return new RevokedStatus(Date.from(certificateSummary.getRevocationTime().atZone(ZoneId.systemDefault()).toInstant()), PRIVILEGE_WITHDRAWN.getCode());
            case EXPIRED:
                return new RevokedStatus(Date.from(certificateSummary.getExpirationTime().atZone(ZoneId.systemDefault()).toInstant()), SUPERSEDED.getCode());
            case UNKNOWN:
                return new UnknownStatus();
            default:
                throw new IllegalArgumentException("Unknown status! " + certificateSummary.getStatus().name());
        }
    }


}
