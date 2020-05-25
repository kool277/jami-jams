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
package net.jami.jams.common.objects.responses;

import lombok.Getter;
import lombok.Setter;
import net.jami.jams.common.utils.X509Utils;

import java.security.cert.X509Certificate;

@Getter
@Setter
public class DeviceRegistrationResponse {

    private String certificateChain;
    private String displayName;
    private String nameServer;
    private String deviceReceipt;
    private String receiptSignature;
    private String userPhoto;

    public void setCertificateChain(X509Certificate[] certificateChain){
        StringBuilder stringBuilder = new StringBuilder();
        for(int i=0;i<certificateChain.length;i++){
            stringBuilder.append(X509Utils.getPEMStringFromCertificate(certificateChain[i])).append("\n");
        }
        //remove the last \n because it's useless.
        stringBuilder.deleteCharAt(stringBuilder.length()-1);
        this.certificateChain = stringBuilder.toString();
    }


}
