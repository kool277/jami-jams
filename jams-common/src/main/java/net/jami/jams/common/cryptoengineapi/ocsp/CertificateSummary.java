package net.jami.jams.common.cryptoengineapi.ocsp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.security.auth.x500.X500Principal;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CertificateSummary {

    public static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyMMddHHmmssZ");

    private CertificateStatus status;
    private LocalDateTime expirationTime;
    private LocalDateTime revocationTime;
    private RevocationReason revocationReason;
    private BigInteger serialNumber;
    private String fileName;
    private X500Principal subjectDN;

    public CertificateSummary(CertificateStatus status, LocalDateTime revocationTime, BigInteger serialNumber) {
        this.status = status;
        this.revocationTime = revocationTime;
        this.serialNumber = serialNumber;
    }

    public CertificateSummary(CertificateStatus status, BigInteger serialNumber) {
        this.status = status;
        this.serialNumber = serialNumber;
    }
}
