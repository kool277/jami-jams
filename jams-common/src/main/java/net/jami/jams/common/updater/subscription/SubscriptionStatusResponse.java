package net.jami.jams.common.updater.subscription;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubscriptionStatusResponse {
    private Boolean subscribed;
    private SubscriptionType subscriptionType;
    private Long expiryDate;
}
