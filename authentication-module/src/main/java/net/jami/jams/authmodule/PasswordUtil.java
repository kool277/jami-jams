package net.jami.jams.authmodule;

import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.util.encoders.Hex;

import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;

@Slf4j
public class PasswordUtil {

    static SecureRandom random = new SecureRandom();

    public static String hashPassword(String password, byte[] salt){
        try {
            SecretKeyFactory skf = SecretKeyFactory.getInstance( "PBKDF2WithHmacSHA512" );
            PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, 2048, 512);
            SecretKey key = skf.generateSecret( spec );
            byte[] res = key.getEncoded();
            return new String(Hex.encode(res));
        }
        catch (Exception e){
            log.info("An error occurred while attempting to hash a user password: ", e.toString());
            return null;
        }
    }

    public static byte[] generateSalt() {
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return salt;
    }


}
