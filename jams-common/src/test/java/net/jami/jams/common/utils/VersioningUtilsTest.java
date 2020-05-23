package net.jami.jams.common.utils;

import net.jami.jams.common.updater.FileDescription;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import java.util.HashMap;

class VersioningUtilsTest {

    @Test
    @Disabled
    public void testFileScan(){
        HashMap<String, FileDescription> res = VersioningUtils.checkVersion(null);
        Assertions.assertEquals(6,res.size(),"Incorrect number of versions detected!");
    }


}