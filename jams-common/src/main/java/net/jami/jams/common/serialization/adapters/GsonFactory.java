package net.jami.jams.common.serialization.adapters;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import net.jami.jams.common.objects.contacts.Contact;
import net.jami.jams.common.objects.conversations.Conversation;
import net.jami.jams.common.objects.conversations.ConversationRequest;

import org.bouncycastle.pkcs.PKCS10CertificationRequest;

import java.security.PrivateKey;
import java.security.cert.X509Certificate;

public class GsonFactory {
    public static Gson createGson() {
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.registerTypeAdapter(Contact.class, new ContactAdapter());
        gsonBuilder.registerTypeAdapter(Conversation.class, new ConversationAdapter());
        gsonBuilder.registerTypeAdapter(
                ConversationRequest.class, new ConversationRequestAdapter());
        gsonBuilder.registerTypeAdapter(PKCS10CertificationRequest.class, new CSRDeserializer());
        gsonBuilder.registerTypeAdapter(PrivateKey.class, new PrivateKeyAdapter());
        gsonBuilder.registerTypeAdapter(X509Certificate.class, new X509CertificateAdapter());
        Gson gson = gsonBuilder.create();
        return gson;
    }
}
