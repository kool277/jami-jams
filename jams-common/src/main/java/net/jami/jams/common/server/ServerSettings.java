package net.jami.jams.common.server;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServerSettings {

    private String ldapConfiguration;
    private String caConfiguration;
    private String activeDirectoryConfiguration;
    private String localDirectoryConfiguration;
    private String serverPublicURI;

}
