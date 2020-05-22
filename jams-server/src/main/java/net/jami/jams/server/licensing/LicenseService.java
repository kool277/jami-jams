package net.jami.jams.server.licensing;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.server.Server;
import org.json.JSONObject;

import javax.naming.ldap.LdapName;
import javax.naming.ldap.Rdn;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.Base64;
import java.util.concurrent.atomic.AtomicBoolean;

@Getter
@Setter
@Slf4j
public class LicenseService {

    private AtomicBoolean activationStatus = new AtomicBoolean(false);
    private String licenseType = "COMMUNITY";

    //Load the license.
    public void loadLicense() {
        try {
            CertificateFactory cf = CertificateFactory.getInstance("X.509");
            //Assuming the file exists, we just read the file.
            String b64License = new String(Files.readAllBytes(Path.of(System.getProperty("user.dir") + File.separator + "license.dat")));
            //Since this is base64, we need to decode it.
            String strLicense = new String(Base64.getDecoder().decode(b64License));
            //Now we need to split it. This is actually easy.
            int cutPoint = strLicense.indexOf("-----BEGIN PRIVATE KEY-----");
            String publicKey = strLicense.substring(0,cutPoint);

            InputStream inputStream = new ByteArrayInputStream(publicKey.getBytes(StandardCharsets.UTF_8));
            Certificate c = cf.generateCertificate(inputStream);
            String dn = ((X509Certificate)c).getSubjectDN().toString();
            LdapName ln = new LdapName(dn);
            byte[] array = null;
            for(Rdn rdn : ln.getRdns()) {
                try {
                    array = Base64.getDecoder().decode(((String)rdn.getValue()).getBytes());
                } catch (IllegalArgumentException e) {

                }
            }

            //This is kept inside the resources/oem folder, this is a lot less violent than what we had before.
            //TODO: You should re-use the same technique to validate whatever they stick in the textbox.
            InputStream input = LicenseService.class.getClassLoader().getResourceAsStream("oem/ca.crt");
            if (input == null) {
                System.out.println("No CA Found... this is critical!");
                System.exit(-1);
            }
            Certificate ca = cf.generateCertificate(input);
            try{
                ((X509Certificate) c).checkValidity();
                c.verify(ca.getPublicKey());
                Server.activated.set(true);
                if (array != null) {
                    JSONObject jsonObject = new JSONObject(new String(array));
                    licenseType = (String) jsonObject.get("type");
                }
            }
            catch (Exception e){
                Server.activated.set(false);
                licenseType = "COMMUNITY";
                log.warn("Your license is no longer valid or has been tampered with - " + e.toString());
            }
        }
        catch (Exception e){
            Server.setActivated(false);
            licenseType = "COMMUNITY";
            //logger.warning("An exception occurred while checking your license: " + e.toString());
        }
    }

    public String getLicenseType() {
        loadLicense();
        return licenseType;
    }
}
