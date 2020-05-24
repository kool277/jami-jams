package net.jami.jams.server.licensing;

import org.junit.jupiter.api.Test;

class LicenseServiceTest {

    @Test
    public void loadLicenseTest(){
        LicenseService licenseService = new LicenseService();
        licenseService.loadLicense();
    }

}