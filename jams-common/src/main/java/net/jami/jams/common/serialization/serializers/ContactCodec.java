package net.jami.jams.common.serialization.serializers;

import com.jsoniter.JsonIterator;
import com.jsoniter.any.Any;
import com.jsoniter.output.JsonStream;
import com.jsoniter.spi.Decoder;
import com.jsoniter.spi.Encoder;
import net.jami.jams.common.objects.contacts.Contact;

import java.io.IOException;

public class ContactCodec implements Encoder, Decoder {

    @Override
    public Object decode(JsonIterator jsonIterator) throws IOException {
        Any input = jsonIterator.readAny();
        Contact contact = new Contact();
        contact.setUri(input.get("uri").toString());
        if(!input.get("added").toString().isBlank()){
            contact.setStatus('A');
            contact.setTimestamp(input.get("added").toLong());
        }
        else{
            contact.setStatus('D');
            contact.setTimestamp(input.get("removed").toLong());
        }
        return contact;
    }

    @Override
    public void encode(Object o, JsonStream jsonStream) throws IOException {
        Contact ct = (Contact) o;
        StringBuilder sb = new StringBuilder();
        sb.append("{\"uri\":\"").append(ct.getUri()).append("\",");
        switch (ct.getStatus()){
            case 'A': sb.append("\"added\":").append(ct.getTimestamp()); break;
            case 'D': sb.append("\"removed\":").append(ct.getTimestamp()); break;
        }
        sb.append("}");
        jsonStream.write(sb.toString().getBytes());
    }
}
