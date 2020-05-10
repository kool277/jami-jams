package net.jami.jams.common.authentication.activedirectory;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActiveDirectorySettings {
    private Boolean ssl;
    private int     port;
    private String  realm;
    private String  host;
    private String  username;
    private String  password;
}
