package net.jami.jams.common.jami;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NameRegistrationRequest {
    public String addr;
    public String owner;
    public String signature;
    public String publickey;
}
