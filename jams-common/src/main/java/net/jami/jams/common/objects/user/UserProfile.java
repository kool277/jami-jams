package net.jami.jams.common.objects.user;

import lombok.Getter;
import lombok.Setter;

import java.lang.reflect.Method;
import java.util.HashMap;

@Getter
@Setter
public class UserProfile {

    public static HashMap<String, Method> exposedMethods = new HashMap<>();

    static {
        for (Method method : UserProfile.class.getMethods()) {
            exposedMethods.put(method.getName(), method);
        }
    }

    //We sort of need the username here, because it's our only way of creating users which never existed.
    private String username;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String phoneNumberExtension;
    private String mobileNumber;
    private String faxNumber;
    private String profilePicture;
    private String email;
    private String organization;


}
