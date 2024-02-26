package net.jami.jams.common.serialization.adapters;

import com.google.gson.*;

import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.common.utils.X509Utils;

import java.lang.reflect.Type;

public class UserAdapter implements JsonSerializer<User>, JsonDeserializer<User> {

    @Override
    public User deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
            throws JsonParseException {
        JsonObject input = json.getAsJsonObject();
        User user = new User();
        user.setUsername(input.get("username").getAsString());
        user.setUserType(AuthenticationSourceType.fromString(input.get("userType").getAsString()));
        user.setRealm(input.get("realm").getAsString());
        user.setAccessLevel(AccessLevel.fromString(input.get("accessLevel").getAsString()));
        user.setNeedsPasswordReset(input.get("needsPasswordReset").getAsBoolean());
        user.setEthAddress(input.get("ethAddress").getAsString());
        user.setJamiId(input.get("jamiId").getAsString());
        user.setCertificate(
                X509Utils.getCertificateFromPEMString(input.get("certificate").getAsString()));
        user.setRevoked(input.get("revoked").getAsBoolean());
        return user;
    }

    @Override
    public JsonElement serialize(User user, Type typeOfSrc, JsonSerializationContext context) {
        JsonObject output = new JsonObject();
        output.addProperty("username", user.getUsername());
        output.addProperty("userType", user.getUserType().toString());
        output.addProperty("realm", user.getRealm());
        output.addProperty("accessLevel", user.getAccessLevelName());
        output.addProperty("needsPasswordReset", user.getNeedsPasswordReset());
        output.addProperty("ethAddress", user.getEthAddress());
        output.addProperty("jamiId", user.getJamiId());
        output.addProperty(
                "certificate", X509Utils.getPEMStringFromCertificate(user.getCertificate()));
        output.addProperty("revoked", user.getRevoked());
        return output;
    }
}
