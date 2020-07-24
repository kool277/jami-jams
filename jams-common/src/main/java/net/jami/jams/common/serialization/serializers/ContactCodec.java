package net.jami.jams.common.serialization.serializers;

import com.jsoniter.JsonIterator;
import com.jsoniter.any.Any;
import com.jsoniter.output.JsonStream;
import com.jsoniter.spi.Decoder;
import com.jsoniter.spi.Encoder;
import net.jami.jams.common.objects.contacts.Contact;

import java.io.IOException;

public class ContactCodec implements Encoder, Decoder {

    /**
     * {
     *         "added" : 1595523510,
     *         "banned" : false,
     *         "uri" : "520290d7f45e5811fe5af637d328e7fbf5e8cab9",
     *         "removed" : 0
     *     }
     */
    @Override
    public Object decode(JsonIterator jsonIterator) throws IOException {
        Any input = jsonIterator.readAny();
        Contact contact = new Contact();
        contact.setUri(input.get("uri").toString());
        long timeAdded = 0L;
        long timeRemoved = 0L;
        if(!input.get("added").toString().isBlank())
            timeAdded = input.get("added").toLong();
        if(!input.get("removed").toString().isBlank()){
            timeRemoved = input.get("removed").toLong();
        }
        if(timeAdded >= timeRemoved){
            contact.setStatus('A');
            contact.setTimestamp(input.get("added").toLong());
        }
        else{
            contact.setStatus('D');
            contact.setTimestamp(input.get("removed").toLong());
        }
        if(!input.get("banned").toString().isBlank()) contact.setBanned(input.get("banned").as(Boolean.class));
        if(!input.get("confirmed").toString().isBlank()) contact.setConfirmed(input.get("confirmed").as(Boolean.class));
        return contact;
    }

    @Override
    public void encode(Object o, JsonStream jsonStream) throws IOException {
        Contact ct = (Contact) o;
        StringBuilder sb = new StringBuilder();
        sb.append("{\"uri\":\"").append(ct.getUri()).append("\",");
        switch (ct.getStatus()){
            case 'A':
                sb.append("\"added\":").append(ct.getTimestamp());
                sb.append(",");
                sb.append("\"confirmed\":").append(ct.getConfirmed());
                break;
            case 'D': sb.append("\"removed\":").append(ct.getTimestamp());
                if(ct.getBanned()) sb.append(",").append("\"banned\":").append(ct.getBanned());
                break;
        }
        sb.append("}");
        jsonStream.write(sb.toString().getBytes());
    }
}
