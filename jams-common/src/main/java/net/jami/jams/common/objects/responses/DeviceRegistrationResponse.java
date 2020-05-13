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
