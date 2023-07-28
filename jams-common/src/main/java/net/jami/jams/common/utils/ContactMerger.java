package net.jami.jams.common.utils;

import net.jami.jams.common.objects.contacts.Contact;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;

public class ContactMerger {

    public static List<Contact> mergeContacts(List<Contact> remote, List<Contact> local) {
        // uri - [remote,local]
        List<Contact> output = new ArrayList<>();
        final HashMap<String, Contact[]> contactMap = new HashMap<>();
        remote.sort(Comparator.comparingLong(Contact::getTimestamp));
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
                        // Compare by date an choose the proper one
                        if (v[0].getTimestamp() > v[1].getTimestamp()) output.add(v[0]);
                        else output.add(v[1]);
                    }
                });
        return output;
    }
}
