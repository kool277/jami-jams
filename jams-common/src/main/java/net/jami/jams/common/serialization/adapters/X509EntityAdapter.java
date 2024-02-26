package net.jami.jams.common.serialization.adapters;

import com.google.gson.*;

import net.jami.jams.common.objects.roots.X509Entity;
import net.jami.jams.common.utils.X509Utils;

import java.lang.reflect.Type;

public class X509EntityAdapter implements JsonSerializer<X509Entity>, JsonDeserializer<X509Entity> {
    @Override
    public X509Entity deserialize(
            JsonElement json, Type typeOfT, JsonDeserializationContext context)
            throws JsonParseException {
        JsonObject input = json.getAsJsonObject();
        X509Entity entity = new X509Entity();
        entity.setCertificate(
                X509Utils.getCertificateFromPEMString(input.get("certificate").getAsString()));
        entity.setPrivateKey(X509Utils.getKeyFromPEMString(input.get("privateKey").getAsString()));
        return entity;
    }

    @Override
    public JsonElement serialize(X509Entity src, Type typeOfSrc, JsonSerializationContext context) {
        JsonObject output = new JsonObject();
        output.addProperty(
                "certificate", X509Utils.getPEMStringFromCertificate(src.getCertificate()));
        output.addProperty("privateKey", X509Utils.getPEMStringFromPrivateKey(src.getPrivateKey()));
        return output;
    }
}
