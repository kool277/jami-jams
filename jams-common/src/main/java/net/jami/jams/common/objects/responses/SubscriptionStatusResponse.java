package net.jami.jams.common.objects.responses;

import lombok.Getter;
import lombok.Setter;
import net.jami.jams.common.updater.subscription.LicenseInformation;

import java.util.HashMap;

import static net.jami.jams.common.utils.VersioningUtils.checkVersion;

@Getter
@Setter
public class SubscriptionStatusResponse {

    private LicenseInformation licenseInformation;
    private Boolean activated;
    private HashMap<String,String> versions = checkVersion();

}
