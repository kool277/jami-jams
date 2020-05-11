package net.jami.jams.common.objects.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeviceServletResponse {

    private String certificateChain;
    private String displayName;
    private String nameServer;
    private String deviceReceipt;
    private String receiptSignature;
    private String userPhoto;

}
