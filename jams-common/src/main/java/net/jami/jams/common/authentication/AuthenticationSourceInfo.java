package net.jami.jams.common.authentication;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationSourceInfo {

    private String realm;
    private AuthenticationSourceType authenticationSourceType;

}
