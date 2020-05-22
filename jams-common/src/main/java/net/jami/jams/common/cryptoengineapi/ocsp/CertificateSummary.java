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
