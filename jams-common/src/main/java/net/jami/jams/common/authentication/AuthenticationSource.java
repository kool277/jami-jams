package net.jami.jams.common.authentication;

import net.jami.jams.common.objects.user.User;
import net.jami.jams.common.objects.user.UserProfile;

public interface AuthenticationSource {

    boolean createUser(User user);
    UserProfile getUserProfile(String queryString, String field);
    boolean authenticate(String username, String password);
    AuthenticationSourceInfo getInfo();
    boolean testConfiguration(String configuration);
    boolean updatePassword(User user, String password);

}
