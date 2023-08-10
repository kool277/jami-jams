package net.jami.jams.common.serialization.adapters;

import com.google.gson.*;

import net.jami.jams.common.objects.contacts.Contact;

import java.lang.reflect.Type;

public class ContactAdapter implements JsonSerializer<Contact>, JsonDeserializer<Contact> {

    /**
     * {
     *     "added" : 1595523510,
     *     "banned" : false,
     *     "uri" : "520290d7f45e5811fe5af637d328e7fbf5e8cab9",
     *     "removed" : 0,
     *     "conversationId": "6a61013979964f70c8fb9183a8b238d58a1846ed"
     * }
     */
    @Override
    public Contact deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
            throws JsonParseException {
        JsonObject input = json.getAsJsonObject();
        Contact contact = new Contact();
        contact.setUri(input.get("uri").getAsString());
        contact.setConversationId(input.get("conversationId").getAsString());


        long timeAdded = 0L;
        if (input.has("added")) {
            timeAdded = input.get("added").getAsLong();
        }

        long timeRemoved = 0L;
        if (input.has("removed")) {
            timeRemoved = input.get("removed").getAsLong();
        }

        if (timeAdded >= timeRemoved) {
            contact.setStatus('A');
            contact.setTimestamp(timeAdded);
            if (input.has("confirmed")) {
                contact.setConfirmed(input.get("confirmed").getAsBoolean());
            }
        } else {
            contact.setStatus('D');
            contact.setTimestamp(timeRemoved);
            if (input.has("banned")) {
                contact.setBanned(input.get("banned").getAsBoolean());
            }
        }
        return contact;
    }

    @Override
    public JsonElement serialize(
            Contact contact, Type typeOfSrc, JsonSerializationContext context) {
        JsonObject output = new JsonObject();
        output.addProperty("uri", contact.getUri());
        output.addProperty("conversationId", contact.getConversationId());
        switch (contact.getStatus()) {
            case 'A':
                output.addProperty("added", contact.getTimestamp());
                if (contact.getConfirmed() != null) {
                    output.addProperty("confirmed", contact.getConfirmed());
                }
                break;
            case 'D':
                output.addProperty("removed", contact.getTimestamp());
                if (contact.getBanned() != null) {
                    output.addProperty("banned", contact.getBanned());
                }
                break;
        }
        return output;
    }
}
