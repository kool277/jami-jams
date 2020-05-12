package net.jami.jams.server.servlets.api.install;

import net.jami.jams.common.authentication.activedirectory.ActiveDirectorySettings;
import net.jami.jams.common.authentication.ldap.LDAPSettings;
import net.jami.jams.common.authentication.local.LocalAuthSettings;
import net.jami.jams.common.cryptoengineapi.CertificateAuthorityConfig;
import net.jami.jams.common.objects.requests.CreateCARequest;

public class CachedObjects {

    public static String endpoint = "start";
    public static CertificateAuthorityConfig certificateAuthorityConfig;
    public static CreateCARequest createCARequest;
    public static LDAPSettings ldapSettings;
    public static ActiveDirectorySettings activeDirectorySettings;
    public static LocalAuthSettings localAuthSettings;
}
