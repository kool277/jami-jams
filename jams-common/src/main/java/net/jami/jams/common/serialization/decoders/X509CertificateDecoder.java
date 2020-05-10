package net.jami.jams.common.serialization.decoders;

import com.jsoniter.JsonIterator;
import com.jsoniter.spi.Decoder;
import net.jami.jams.common.utils.X509Utils;

import java.io.IOException;

public class X509CertificateDecoder implements Decoder {

    @Override
    public Object decode(JsonIterator jsonIterator) throws IOException {
        return X509Utils.getCertificateFromPEMString(jsonIterator.readString());
    }
}
