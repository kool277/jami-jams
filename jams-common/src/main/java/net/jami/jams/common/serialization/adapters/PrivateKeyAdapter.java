package net.jami.jams.common.serialization.adapters;

import com.google.gson.*;

import net.jami.jams.common.utils.X509Utils;

import java.lang.reflect.Type;
import java.security.PrivateKey;

public class PrivateKeyAdapter implements JsonSerializer<PrivateKey>, JsonDeserializer<PrivateKey> {
    @Override
    public PrivateKey deserialize(
            JsonElement json, Type typeOfT, JsonDeserializationContext context)
            throws JsonParseException {
        return X509Utils.getKeyFromPEMString(json.getAsString());
    }

    @Override
    public JsonElement serialize(PrivateKey src, Type typeOfSrc, JsonSerializationContext context) {
        return new JsonPrimitive(X509Utils.getPEMStringFromPrivateKey(src));
    }
}
