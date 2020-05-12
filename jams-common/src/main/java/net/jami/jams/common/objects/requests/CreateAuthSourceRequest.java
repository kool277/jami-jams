package net.jami.jams.common.objects.requests;

import lombok.Getter;
import lombok.Setter;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.authentication.activedirectory.ActiveDirectorySettings;
import net.jami.jams.common.authentication.ldap.LDAPSettings;
import net.jami.jams.common.authentication.local.LocalAuthSettings;

@Getter
@Setter
public class CreateAuthSourceRequest {

    private AuthenticationSourceType type;
    private LDAPSettings ldapSettings;
    private ActiveDirectorySettings activeDirectorySettings;
    private LocalAuthSettings localAuthSettings;

}
