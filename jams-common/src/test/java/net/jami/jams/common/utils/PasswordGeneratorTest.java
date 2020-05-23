package net.jami.jams.common.utils;

import org.junit.jupiter.api.Test;

class PasswordGeneratorTest {

    @Test
    void testPasswordGeneration() {
        char[] res = PasswordGenerator.generatePassword();
        System.out.println(res);
    }
}