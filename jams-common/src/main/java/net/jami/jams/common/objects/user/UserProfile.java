package net.jami.jams.common.objects.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfile {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String profilePicture;
    private String email;
}
