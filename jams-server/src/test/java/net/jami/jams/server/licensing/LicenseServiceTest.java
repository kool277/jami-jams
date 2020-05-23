package net.jami.jams.server.licensing;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LicenseServiceTest {

    @Test
    public void loadLicenseTest(){
        LicenseService licenseService = new LicenseService();
        licenseService.loadLicense();
    }

}