package net.jami.jams.common.serialization;

import com.jsoniter.JsonIterator;
import com.jsoniter.output.JsonStream;
import net.jami.jams.common.objects.requests.EnrollementRequest;
import net.jami.jams.common.objects.roots.X509Entity;
import net.jami.jams.common.utils.X509Utils;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.InputStream;

import static org.junit.jupiter.api.Assertions.fail;

class JsoniterRegistryTest {

    static String strPrivateKey;
    static String strCertificate;
    static String strPkcs10Request;

    @BeforeAll
    public static void loadProps(){
        try {
            JsoniterRegistry.initCodecs();
            InputStream path;
            ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
            path = classLoader.getResourceAsStream("cakey.txt");
            strPrivateKey = new String(path.readAllBytes());
            path = classLoader.getResourceAsStream("cacert.txt");
            strCertificate = new String(path.readAllBytes());
            path = classLoader.getResourceAsStream("pkcs10request.txt");
            strPkcs10Request = new String(path.readAllBytes());
        }
        catch (Exception e){
            fail("Could not set-up resources for test!");
        }
    }

    @Test
    void X509SerializationAndDeserialization(){
        X509Entity entity = new X509Entity();
        entity.setCertificate(X509Utils.getCertificateFromPEMString(strCertificate));
        entity.setPrivateKey(X509Utils.getKeyFromPEMString(strPrivateKey));
        String x = JsonStream.serialize(entity);
        Assertions.assertNotNull(x,"Serialization failed!");
        entity = null;
        entity = JsonIterator.deserialize(x,X509Entity.class);
        Assertions.assertNotNull(entity.getCertificate(),"Certificate was not parsed!");
        Assertions.assertNotNull(entity.getPrivateKey(),"Private key was not parsed!");
    }

    @Test
    void CSRDeserializeTest(){
        String input = "{\"csr\":\"" + strPkcs10Request + "\"}";
        EnrollementRequest request = JsonIterator.deserialize(input,EnrollementRequest.class);
        Assertions.assertNotNull(request.getCsr(),"CSR Should not have been null!");
    }

}