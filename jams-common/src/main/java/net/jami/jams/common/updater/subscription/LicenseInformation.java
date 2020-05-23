package net.jami.jams.common.updater.subscription;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class LicenseInformation {

    private SubscriptionType type = SubscriptionType.COMMUNITY;
    private List<String> products = new ArrayList<>();

}
