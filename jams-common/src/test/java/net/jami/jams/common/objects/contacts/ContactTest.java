package net.jami.jams.common.objects.contacts;

import com.jsoniter.JsonIterator;
import com.jsoniter.output.JsonStream;
import com.jsoniter.spi.JsoniterSpi;
import net.jami.jams.common.serialization.serializers.ContactCodec;
import net.jami.jams.common.utils.ContactMerger;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ContactTest {

    @BeforeAll
    public static void init(){
        JsoniterSpi.registerTypeDecoder(Contact.class,new ContactCodec());
        JsoniterSpi.registerTypeEncoder(Contact.class,new ContactCodec());
    }

    @Test
    public void deserialize(){
        String str = "[{\"uri\":\"tcp://def@local\",\"added\":1594742298377},{\"uri\":\"tcp://abc@19293.com\",\"removed\":1594742298377}]";
        Contact[] contacts = JsonIterator.deserialize(str,Contact[].class);
        Assertions.assertEquals(2,contacts.length);
    }

    @Test
    public void serialize(){
        Contact contact1 = new Contact();
        contact1.setOwner("fsidokhine");
        contact1.setStatus('A');
        contact1.setTimestamp(System.currentTimeMillis());
        contact1.setUri("tcp://def@local");
        Contact contact2 = new Contact();
        contact2.setOwner("fsidokhine");
        contact2.setStatus('D');
        contact2.setTimestamp(System.currentTimeMillis());
        contact2.setUri("tcp://abc@19293.com");
        ArrayList<Contact> lst = new ArrayList<>();
        lst.add(contact1);
        lst.add(contact2);
        String str = JsonStream.serialize(lst);
        Assertions.assertNotNull(str);
    }

    @Test
    public void mergeTest(){
        Contact contact1 = new Contact();
        contact1.setOwner("fsidokhine");
        contact1.setStatus('A');
        contact1.setTimestamp(System.currentTimeMillis());
        contact1.setUri("tcp://def@local");
        Contact contact2 = new Contact();
        contact2.setOwner("fsidokhine");
        contact2.setStatus('D');
        contact2.setTimestamp(System.currentTimeMillis());
        contact2.setUri("tcp://abc@19293.com");
        ArrayList<Contact> lst = new ArrayList<>();
        lst.add(contact1);
        lst.add(contact2);
        Contact contact3 = new Contact();
        contact3.setOwner("fsidokhine");
        contact3.setStatus('A');
        contact3.setTimestamp(System.currentTimeMillis() + 10000);
        contact3.setUri("tcp://abc@19293.com");
        ArrayList<Contact> lst2 = new ArrayList<>();
        lst2.add(contact3);
        List<Contact> out = ContactMerger.mergeContacts(lst,lst2);
        Assertions.assertEquals(2,out.size());
    }
}