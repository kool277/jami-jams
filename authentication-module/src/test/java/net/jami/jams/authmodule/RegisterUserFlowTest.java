package net.jami.jams.authmodule;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;

import net.jami.datastore.dao.UserDao;
import net.jami.datastore.main.DataStore;
import net.jami.jams.common.cryptoengineapi.CertificateAuthority;
import net.jami.jams.common.jami.NameRegistrationRequest;
import net.jami.jams.common.jami.NameServer;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.User;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.File;

@ExtendWith(MockitoExtension.class)
class RegisterUserFlowTest {
    @Mock private static DataStore dataStoreMock;
    @Mock private static UserDao userDaoMock;
    @Mock private static CertificateAuthority certificateAuthorityMock;
    @Mock private NameServer nameServer;
    private static UserAuthenticationModule userAuthModule;
    private User user = new User();

    @BeforeEach
    void setUp() {
        user.setUsername("Test User");
        user.setAccessLevel(AccessLevel.USER);
        mockStatic(UserAuthenticationModule.class);
        when(nameServer.registerName(any(String.class), any(NameRegistrationRequest.class)))
                .thenReturn(200);
        when(dataStoreMock.getUserDao()).thenReturn(userDaoMock);
        when(userDaoMock.storeObject(any(User.class))).thenReturn(true);
        when(certificateAuthorityMock.getSignedCertificate(any(User.class))).thenReturn(user);
        try {
            userAuthModule = new UserAuthenticationModule(dataStoreMock, certificateAuthorityMock);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @AfterAll
    public static void tearDown() {
        // Remove generated key files
        File pubkeyFile = new File(System.getProperty("user.dir") + File.separator + "oauth.pub");
        if (pubkeyFile.exists()) {
            pubkeyFile.delete();
        }
        File privateKeyFile =
                new File(System.getProperty("user.dir") + File.separator + "oauth.key");
        if (privateKeyFile.exists()) {
            privateKeyFile.delete();
        }
    }

    @Test
    void createUser() {
        boolean userCreationSuccess = RegisterUserFlow.createUser(user, nameServer);
        Assertions.assertTrue(userCreationSuccess);
    }
}
