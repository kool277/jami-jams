package net.jami.jams.common.serialization.encoders;

import com.jsoniter.output.JsonStream;
import com.jsoniter.spi.Encoder;
import net.jami.jams.common.utils.X509Utils;

import java.io.IOException;
import java.security.cert.X509Certificate;

public class X509CertificateEncoder implements Encoder {

    @Override
    public void encode(Object o, JsonStream jsonStream) throws IOException {
        jsonStream.write(("\"" + X509Utils.getPEMStringFromCertificate((X509Certificate) o) + "\"").getBytes());
    }
}
