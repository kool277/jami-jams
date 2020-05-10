package net.jami.datastore.dao;

import net.jami.jams.common.objects.contacts.Contact;

import java.util.LinkedHashMap;

public class ContactDao extends AbstractDao<Contact> {

    @Override
    public boolean storeObject(Contact object) {
        return false;
    }

    @Override
    public boolean deleteObject(LinkedHashMap<String, String> constraints) {
        return false;
    }
}
