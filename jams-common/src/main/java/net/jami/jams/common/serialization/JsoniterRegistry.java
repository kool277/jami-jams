package net.jami.jams.common.serialization;

import com.jsoniter.JsonIterator;
import com.jsoniter.output.EncodingMode;
import com.jsoniter.output.JsonStream;
import com.jsoniter.spi.DecodingMode;
import com.jsoniter.spi.JsoniterSpi;
import net.jami.jams.common.serialization.decoders.CSRDecoder;
import net.jami.jams.common.serialization.decoders.PrivateKeyDecoder;
import net.jami.jams.common.serialization.decoders.X509CertificateDecoder;
import net.jami.jams.common.serialization.encoders.PrivateKeyEncoder;
import net.jami.jams.common.serialization.encoders.X509CertificateEncoder;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;

import java.security.PrivateKey;
import java.security.cert.X509Certificate;

public class JsoniterRegistry {

    public static void initCodecs(){
        JsonStream.setMode(EncodingMode.DYNAMIC_MODE);
        JsonIterator.setMode(DecodingMode.DYNAMIC_MODE_AND_MATCH_FIELD_WITH_HASH);
        JsoniterSpi.registerTypeDecoder(X509Certificate.class,new X509CertificateDecoder());
        JsoniterSpi.registerTypeDecoder(PrivateKey.class,new PrivateKeyDecoder());
        JsoniterSpi.registerTypeEncoder(X509Certificate.class,new X509CertificateEncoder());
        JsoniterSpi.registerTypeEncoder(PrivateKey.class,new PrivateKeyEncoder());
        JsoniterSpi.registerTypeDecoder(PKCS10CertificationRequest.class,new CSRDecoder());
    }


}
