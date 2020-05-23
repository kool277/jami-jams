package net.jami.jams.server.licensing;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.updater.subscription.LicenseInformation;
import net.jami.jams.common.utils.X509Utils;
import net.jami.jams.server.Server;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.PrivateKey;
import java.security.cert.CertificateExpiredException;
import java.security.cert.CertificateNotYetValidException;
import java.security.cert.X509Certificate;
import java.util.Vector;

@Getter
@Setter
@Slf4j
public class LicenseService {

    private X509Certificate certificate;
    private PrivateKey privateKey;
    private X509Certificate caCertificate;
    private LicenseInformation licenseInformation = new LicenseInformation();

    //Load the license.
    public void loadLicense() {
        try {
            Vector<Object> v = X509Utils.loadLicenseFromDatFile(
                    new String(Files.readAllBytes(Path.of(System.getProperty("user.dir") + File.separator + "license.dat")))
            );
            certificate = (X509Certificate) v.get(0);
            privateKey = (PrivateKey) v.get(1);
            caCertificate = X509Utils.getCertificateFromPEMString(
                    new String(LicenseService.class.getClassLoader().getResourceAsStream("oem/ca.crt").readAllBytes())
            );
            //Check the license for validity.
            try {
                certificate.checkValidity();
            }
            catch (CertificateExpiredException | CertificateNotYetValidException c2){
                log.error("Your license is not yet valid or has expired!");
                Server.activated.set(false);
            }
            try {
                certificate.verify(caCertificate.getPublicKey());
            }
            catch (Exception e) {
                log.error("The license file you have provided could not be verified!");
                Server.activated.set(false);
            }
            //If all these checks have passed then:
            Server.activated.set(true);
            licenseInformation = X509Utils.extractSubscriptionTypeFromCertificate(certificate);
            log.info("Server is activated with valid license: {}", Server.activated.get());
            log.info("License type: {}",licenseInformation.getType());
            Server.appUpdater.setLicense(certificate,privateKey);
            log.info("Successfully set license inside updater module!");
        }
        catch (Exception e){
            log.error("A generic occurred while trying to load your license or your license could not be found");
            Server.activated.set(false);
        }
    }
}
