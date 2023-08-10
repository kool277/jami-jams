package net.jami.jams.common.serialization.adapters;

import com.google.gson.*;

import net.jami.jams.common.utils.X509Utils;

import org.bouncycastle.pkcs.PKCS10CertificationRequest;

import java.lang.reflect.Type;

public class CSRDeserializer implements JsonDeserializer<PKCS10CertificationRequest> {
    @Override
    public PKCS10CertificationRequest deserialize(
            JsonElement json, Type typeOfT, JsonDeserializationContext context)
            throws JsonParseException {
        return X509Utils.getCSRFromString(json.getAsString());
    }
}
