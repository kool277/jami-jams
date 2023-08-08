package net.jami.jams.ad.connector;

import static org.junit.jupiter.api.Assertions.*;

import com.google.gson.Gson;

import net.jami.jams.common.authentication.activedirectory.ActiveDirectorySettings;
import net.jami.jams.common.objects.user.UserProfile;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ADConnectorTest {
    private ADConnector adConnector;

    @BeforeEach
    void setUp() {
        Gson gson = new Gson();
        ActiveDirectorySettings activeDirectorySettings = new ActiveDirectorySettings();
        String settings = gson.toJson(activeDirectorySettings);
        adConnector = new ADConnector(settings);
    }

    @Test
    void testGetUserProfile() {
        UserProfile userProfile = adConnector.getUserProfile("jdoe");
        assertNull(userProfile);
    }
}
