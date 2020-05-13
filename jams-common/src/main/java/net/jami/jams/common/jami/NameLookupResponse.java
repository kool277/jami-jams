package net.jami.jams.common.jami;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NameLookupResponse {
    private String name;
    private String addr;
    private String publickey;
    private String signature;
}
