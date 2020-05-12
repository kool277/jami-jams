package net.jami.jams.common.jami;

public interface NameServer {
    Integer registerName(String username);
    String getAddressFromName(String username);
    String getNameFromAddress(String address);
}
