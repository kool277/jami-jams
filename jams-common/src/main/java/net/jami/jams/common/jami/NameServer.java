package net.jami.jams.common.jami;

public interface NameServer {
    Integer registerName();
    String getAddressFromName();
    String getNameFromAddress();
}
