package net.jami.jams.common.objects.system;

import lombok.Getter;
import lombok.Setter;
import net.jami.jams.common.objects.roots.X509Entity;

@Getter
@Setter
public class SystemAccount extends X509Entity {

    private SystemAccountType systemAccountType;
}
