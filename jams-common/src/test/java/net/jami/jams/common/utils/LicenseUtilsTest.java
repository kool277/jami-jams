package net.jami.jams.common.utils;

import org.junit.jupiter.api.Test;

import java.util.HashMap;

class LicenseUtilsTest {

    @Test
    public void testFileScan(){
        HashMap<String,String> res = LicenseUtils.checkVersion();
        System.out.println(res);
    }


}