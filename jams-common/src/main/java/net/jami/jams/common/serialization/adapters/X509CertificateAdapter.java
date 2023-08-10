package net.jami.jams.common.serialization.adapters;

import com.google.gson.*;

import net.jami.jams.common.utils.X509Utils;

import java.lang.reflect.Type;
import java.security.cert.X509Certificate;

public class X509CertificateAdapter
        implements JsonSerializer<X509Certificate>, JsonDeserializer<X509Certificate> {
    @Override
    public X509Certificate deserialize(
            JsonElement json, Type typeOfT, JsonDeserializationContext context)
            throws JsonParseException {
        return X509Utils.getCertificateFromPEMString(json.getAsString());
    }

    @Override
    public JsonElement serialize(
            X509Certificate src, Type typeOfSrc, JsonSerializationContext context) {
        return new JsonPrimitive(X509Utils.getPEMStringFromCertificate(src));
    }
}
