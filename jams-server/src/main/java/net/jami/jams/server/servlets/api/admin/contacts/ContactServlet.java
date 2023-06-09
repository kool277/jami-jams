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
package net.jami.jams.server.servlets.api.admin.contacts;

import com.jsoniter.JsonIterator;
import com.jsoniter.output.JsonStream;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.common.annotations.JsonContent;
import net.jami.jams.common.annotations.ScopedServletMethod;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.contacts.Contact;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.serialization.tomcat.TomcatCustomErrorHandler;
import net.jami.jams.common.utils.ContactMerger;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

import static net.jami.jams.server.Server.dataStore;

@WebServlet("/api/admin/contacts")
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
    @ScopedServletMethod(securityGroups = { AccessLevel.ADMIN })
    @JsonContent
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        StatementList statementList = new StatementList();
        statementList.addStatement(new StatementElement("owner", "=", req.getParameter("username").toString(), ""));
        List<Contact> contactList = dataStore.getContactDao().getObjects(statementList);
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
    @ScopedServletMethod(securityGroups = { AccessLevel.ADMIN })
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Scanner s = new Scanner(req.getInputStream()).useDelimiter("\\A");
        String res = s.hasNext() ? s.next() : "";
        final JSONObject obj = new JSONObject(res);
        Contact contact = new Contact();
        // TODO: Replace with mergetool.
        contact.setDisplayName(obj.get("displayName").toString());
        contact.setTimestamp(System.currentTimeMillis() / 1000);
        contact.setStatus('A');
        contact.setOwner(req.getParameter("username"));
        contact.setUri(obj.get("uri").toString());
        StatementList statementList = new StatementList();
        statementList.addStatement(new StatementElement("owner", "=", req.getParameter("username").toString(), ""));
        List<Contact> localList = dataStore.getContactDao().getObjects(statementList);
        List<Contact> remoteList = new ArrayList<>();
        remoteList.add(contact);
        List<Contact> result = ContactMerger.mergeContacts(localList, remoteList);
        if (dataStore.getContactDao().storeContactList(result))
            resp.setStatus(200);
        else
            TomcatCustomErrorHandler.sendCustomError(resp, 500, "could not store a contact due to server-side error");
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
    @ScopedServletMethod(securityGroups = { AccessLevel.ADMIN })
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        StatementList statementList = new StatementList();
        statementList.addStatement(new StatementElement("owner", "=", req.getParameter("username").toString(), "AND"));
        statementList.addStatement(new StatementElement("uri", "=", req.getParameter("uri"), ""));
        /*
         * List<Contact> remoteList =
         * dataStore.getContactDao().getObjects(statementList);
         * remoteList.get(0).setStatus('D');
         * remoteList.get(0).setTimestamp(System.currentTimeMillis()); statementList =
         * new StatementList(); statementList.addStatement(new
         * StatementElement("owner","=",req.getParameter("username").toString(),""));
         * List<Contact> localList =
         * dataStore.getContactDao().getObjects(statementList); List<Contact> result =
         * ContactMerger.mergeContacts(localList,remoteList);
         */
        if (dataStore.getContactDao().deleteObject(statementList))
            resp.setStatus(200);
        else
            TomcatCustomErrorHandler.sendCustomError(resp, 500, "could not delete a contact due to server-side error");
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
    @ScopedServletMethod(securityGroups = { AccessLevel.ADMIN })
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        StatementList statementList = new StatementList();
        statementList.addStatement(new StatementElement("owner", "=", req.getParameter("username").toString(), ""));
        List<Contact> localList = dataStore.getContactDao().getObjects(statementList);
        List<Contact> remoteList = Arrays
                .asList(JsonIterator.deserialize(req.getInputStream().readAllBytes(), Contact[].class));
        remoteList.forEach(contact -> contact.setOwner(req.getParameter("username").toString()));
        List<Contact> result = ContactMerger.mergeContacts(localList, remoteList);
        if (!dataStore.getContactDao().storeContactList(result))
            TomcatCustomErrorHandler.sendCustomError(resp, 500, "Could not store contacts!");
        else
            resp.getOutputStream().write(JsonStream.serialize(result).getBytes());
    }
}
