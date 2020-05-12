package net.jami.jams.common.authmodule;

import com.jsoniter.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.jami.jams.common.authentication.AuthenticationSourceType;

@Getter
@Setter
@NoArgsConstructor
public class AuthenticationResult {

    private Boolean authenticated;
    private String  token;
    private Long    expires;

    public AuthenticationResult(Boolean authenticated, String token) {
        this.authenticated = authenticated;
        this.token = token;
        this.expires = System.currentTimeMillis() + 15*60*1_000;
    }
}
