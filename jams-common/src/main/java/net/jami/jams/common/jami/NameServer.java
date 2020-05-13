package net.jami.jams.common.jami;

public interface NameServer {
    Integer registerName(String username, NameRegistrationRequest nameRegistrationRequest);
    NameLookupResponse getAddressFromName(String username);
    String getNameFromAddress(String address);
    String getURI();
}
