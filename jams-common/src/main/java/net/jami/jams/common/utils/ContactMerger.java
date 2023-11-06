package net.jami.jams.common.utils;

import net.jami.jams.common.objects.contacts.Contact;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class ContactMerger {

    public static List<Contact> mergeContacts(List<Contact> remote, List<Contact> local) {
        // uri - [remote,local]
        List<Contact> output = new ArrayList<>();
        final HashMap<String, Contact[]> contactMap = new HashMap<>();
        remote.forEach(
                contact -> {
                    contactMap.putIfAbsent(contact.getUri(), new Contact[] {null, null});
                    contactMap.get(contact.getUri())[0] = contact;
                });
        local.forEach(
                contact -> {
                    contactMap.putIfAbsent(contact.getUri(), new Contact[] {null, null});
                    contactMap.get(contact.getUri())[1] = contact;
                });
        contactMap.forEach(
                (k, v) -> {
                    if (v[0] == null) output.add(v[1]);
                    else if (v[1] == null) output.add(v[0]);
                    else {
                        Contact lastAdded = v[0].getAdded() > v[1].getAdded() ? v[0] : v[1];
                        Contact lastRemoved = v[0].getRemoved() > v[1].getRemoved() ? v[0] : v[1];
                        lastAdded.setAdded(Math.max(v[0].getAdded(), v[1].getAdded()));
                        lastAdded.setRemoved(Math.max(v[0].getRemoved(), v[1].getRemoved()));
                        if (!lastAdded.isAdded()) {
                            lastAdded.setBanned(lastRemoved.getBanned());
                        }
                        output.add(lastAdded);
                    }
                });
        return output;
    }
}
