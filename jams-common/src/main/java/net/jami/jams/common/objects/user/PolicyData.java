package net.jami.jams.common.objects.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PolicyData {

    private Boolean publicInCalls;
    private Boolean proxyEnabled;
    private String dhtProxyListUrl;
    private String proxyServer;
    private Boolean accountPublish;
    private Boolean autoAnswer;
    private String turnServer;
    private String turnServerUserName;
    private String turnServerPassword;
    private Boolean videoEnabled;
    private Boolean turnEnabled;
    private Boolean accountDiscovery;
    private Boolean peerDiscovery;
    private Boolean upnpEnabled;
    private Boolean rendezVous;
    private String defaultModerators;
    private Boolean allowLookup;
    private String uiCustomization;
}
