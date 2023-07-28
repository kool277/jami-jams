/*
 * Copyright (C) 2020 by Savoir-faire Linux
 * Authors: William Enright <william.enright@savoirfairelinux.com>
 *          Ndeye Anna Ndiaye <anna.ndiaye@savoirfairelinux.com>
 *          Johnny Flores <johnny.flores@savoirfairelinux.com>
 *          Mohammed Raza <mohammed.raza@savoirfairelinux.com>
 *          Felix Sidokhine <felix.sidokhine@savoirfairelinux.com>
 *
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
package net.jami.jams.server.servlets.api.auth.contacts;

import static net.jami.jams.server.Server.dataStore;

import com.jsoniter.JsonIterator;
import com.jsoniter.output.JsonStream;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import net.jami.jams.common.objects.contacts.Contact;
import net.jami.jams.common.serialization.tomcat.TomcatCustomErrorHandler;
import net.jami.jams.common.utils.ContactMerger;

import org.json.JSONObject;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

@WebServlet("/api/auth/contacts")
public class ContactServlet extends HttpServlet {

    /**
     * @apiVersion 1.0.0
     * @api {get} /api/auth/contacts View contacts
     * @apiName getContact
     * @apiGroup Contacts
     *
     * @apiSuccess (200) {body} Contact[] List of contacts for the user
     * @apiSuccessExample {json} Success-Response: [{ "uri": "jami://7e3ab29383",
     *                    "added": 18272662662 }, { "uri": "jami://7e3ab29383",
     *                    "removed": 12387873 }, ]
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        String username = req.getAttribute("username").toString();
        List<Contact> contactList = dataStore.getContactDao().getByOwner(username);
        resp.getOutputStream().write(JsonStream.serialize(contactList).getBytes());
    }

    /**
     * @apiVersion 1.0.0
     * @api {put} /api/auth/contacts Add contact
     * @apiName putContact
     * @apiGroup Contacts
     *
     * @apiParam {body} Contact JSON representation of the contact object
     * @apiParamExample {json} Request-Example:
     *      { "uri": "jami://7e3ab29383" }
     *
     * @apiSuccess (200) {null} null successfully added contact
     * @apiError (500) {null} null contact could not be successfully added
     */
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        Scanner s = new Scanner(req.getInputStream()).useDelimiter("\\A");
        String res = s.hasNext() ? s.next() : "";
        final JSONObject obj = new JSONObject(res);

        // TODO: Replace with mergetool.
        Contact contact = new Contact();
        contact.setDisplayName(obj.get("displayName").toString());
        contact.setTimestamp(System.currentTimeMillis() / 1000);
        contact.setStatus('A');
        contact.setOwner(req.getAttribute("username").toString());
        contact.setUri(obj.get("uri").toString());

        String owner = req.getAttribute("username").toString();
        List<Contact> localList = dataStore.getContactDao().getByOwner(owner);

        List<Contact> remoteList = List.of(contact);
        List<Contact> result = ContactMerger.mergeContacts(localList, remoteList);

        if (dataStore.getContactDao().storeContactList(result)) resp.setStatus(200);
        else
            TomcatCustomErrorHandler.sendCustomError(
                    resp, 500, "could not store a contact due to server-side error");
    }

    /**
     * @apiVersion 1.0.0
     * @api {delete} /api/auth/contacts Delete a contact
     * @apiName deleteContact
     * @apiGroup Contacts
     *
     * @apiParam {query} uri uri of the contact to delete
     *
     * @apiSuccess (200) {null} null successfully deleted contact
     * @apiError (500) {null} null contact could not be successfully deleted
     */
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        String owner = req.getAttribute("username").toString();
        String uri = req.getParameter("uri");

        if (dataStore.getContactDao().deleteObject(owner, uri)) resp.setStatus(200);
        else
            TomcatCustomErrorHandler.sendCustomError(
                    resp, 500, "could not delete a contact due to server-side error");
    }

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/auth/contacts Add contact
     * @apiName putContact
     * @apiGroup Contacts
     *
     * @apiParam {body} Contact JSON representation of the contact object
     * @apiParamExample {json} Request-Example: [
     *                  {"uri":"tcp://def@local","added":1594742298377},
     *                  {"uri":"tcp://abc@19293.com","removed":1594742298377} ]
     *
     * @apiSuccess (200) {json} Contact[] successfully added contact
     * @apiError (500) {null} null contact could not be successfully added
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        String owner = req.getAttribute("username").toString();
        List<Contact> localList = dataStore.getContactDao().getByOwner(owner);
        List<Contact> remoteList =
                Arrays.asList(
                        JsonIterator.deserialize(
                                req.getInputStream().readAllBytes(), Contact[].class));

        remoteList.forEach(contact -> contact.setOwner(owner));
        List<Contact> result = ContactMerger.mergeContacts(localList, remoteList);

        if (!dataStore.getContactDao().storeContactList(result))
            TomcatCustomErrorHandler.sendCustomError(resp, 500, "Could not store contacts!");
        else resp.getOutputStream().write(JsonStream.serialize(result).getBytes());
    }
}
