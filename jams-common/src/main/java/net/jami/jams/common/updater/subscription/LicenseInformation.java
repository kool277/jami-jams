package net.jami.jams.common.updater.subscription;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class LicenseInformation {

    //TODO: Possibly add the expiry date here based on the certificate.
    private SubscriptionType type = SubscriptionType.COMMUNITY;
    private List<String> products = new ArrayList<>();

}
