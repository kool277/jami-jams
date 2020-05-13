package net.jami.jams.common.authmodule;

import lombok.Getter;
import lombok.Setter;
import net.jami.jams.common.objects.user.AccessLevel;

@Getter
@Setter
public class AuthTokenResponse {
    private String      token_type;
    private String      access_token;
    private Long        expires_in;
    private AccessLevel scope;
}
