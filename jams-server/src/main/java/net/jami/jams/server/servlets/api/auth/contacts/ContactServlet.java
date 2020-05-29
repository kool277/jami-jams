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

import com.jsoniter.JsonIterator;
import com.jsoniter.output.JsonStream;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.contacts.Contact;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

import static net.jami.jams.server.Server.dataStore;

@WebServlet("/api/auth/contacts")
public class ContactServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        StatementList statementList = new StatementList();
        statementList.addStatement(new StatementElement("owner","=",req.getAttribute("username").toString(),""));
        List<Contact> contactList = dataStore.getContactDao().getObjects(statementList);
        resp.getOutputStream().write(JsonStream.serialize(contactList).getBytes());
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Contact contact = JsonIterator.deserialize(req.getInputStream().readAllBytes(),Contact.class);
        contact.setOwner(req.getAttribute("username").toString());
        if(dataStore.getContactDao().storeObject(contact)) resp.setStatus(200);
        else resp.sendError(500,"Could not store device!");
    }

    //TODO: Because deleting requires sending the URI in the body, didn't want to do this now.
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        StatementList statementList = new StatementList();
        statementList.addStatement(new StatementElement("owner","=",req.getAttribute("username").toString(),"AND"));
        statementList.addStatement(new StatementElement("uri","=",req.getParameter("uri"),""));
        if(dataStore.getContactDao().deleteObject(statementList)) resp.setStatus(200);
        else resp.sendError(500,"Could not delete a contact!");
    }
}
