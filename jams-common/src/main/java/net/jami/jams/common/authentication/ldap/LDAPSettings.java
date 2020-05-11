package net.jami.jams.common.authentication.ldap;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;

@Getter
@Setter
public class LDAPSettings {

    private Boolean useStartTLS;
    private String  realm;
    private String  baseDN;
    private String  host;
    private String  username;
    private String  password;
    private String  usernameField;
    private HashMap<String,String> fieldMappings;

}
