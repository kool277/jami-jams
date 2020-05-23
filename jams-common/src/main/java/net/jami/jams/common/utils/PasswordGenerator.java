package net.jami.jams.common.utils;

import java.security.SecureRandom;

public class PasswordGenerator {

    //Assume all passwords are 12 chars long.
    public static char[] generatePassword(){
        char[] password = new char[12];
        SecureRandom sc = new SecureRandom();
        for(int i=0;i<password.length;i++){
            int x = sc.nextInt(121);
            while(x <= 52)  x = sc.nextInt(121);
            password[i] = (char) x;
        }
        return password;
    }
}
