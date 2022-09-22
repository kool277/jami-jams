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

class ContactTest {

    @BeforeAll
    public static void init(){
        JsoniterSpi.registerTypeDecoder(Contact.class,new ContactCodec());
        JsoniterSpi.registerTypeEncoder(Contact.class,new ContactCodec());
    }

    @Test
    public void deserialize(){
        String str = "[{\"uri\":\"tcp://def@local\",\"added\":1594742298377,\"banned\":false,\"confirmed\":true,\"confirmed\":6a61013979964f70c8fb9183a8b238d58a1846ed}," +
            "{\"uri\":\"tcp://abc@19293.com\",\"removed\":1594742298377,\"banned\":true,\"confirmed\":true,\"confirmed\":2b61024119964f70c8fb9183a8b238d58a1846ed}]";
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
        contact1.setConversationId("6a61013979964f70c8fb9183a8b238d58a1846ed");
        contact1.setBanned(false);
        contact1.setConfirmed(false);
        Contact contact2 = new Contact();
        contact2.setOwner("fsidokhine");
        contact2.setStatus('D');
        contact2.setTimestamp(System.currentTimeMillis());
        contact2.setUri("tcp://abc@19293.com");
        contact2.setConversationId("2b61024119964f70c8fb9183a8b238d58a1846ed");
        contact2.setBanned(true);
        contact2.setConfirmed(true);
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
        contact1.setConversationId("6a61013979964f70c8fb9183a8b238d58a1846ed");
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
        contact3.setConversationId("2b61024119964f70c8fb9183a8b238d58a1846ed");
        ArrayList<Contact> lst2 = new ArrayList<>();
        lst2.add(contact3);
        List<Contact> out = ContactMerger.mergeContacts(lst,lst2);
        Assertions.assertEquals(2,out.size());
    }
}