package net.jami.jams.server.core.usermanagement;

import lombok.*;
import net.jami.jams.common.authentication.AuthenticationSourceType;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class AuthModuleKey {

    private String realm;
    private AuthenticationSourceType type;

}
