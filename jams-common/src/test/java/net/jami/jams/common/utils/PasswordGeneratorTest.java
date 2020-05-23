package net.jami.jams.common.utils;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PasswordGeneratorTest {

    @Test
    void testPasswordGeneration() {
        char[] res = PasswordGenerator.generatePassword();
        System.out.println(res);
    }
}