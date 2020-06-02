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
package net.jami.datastore.main;

import lombok.Getter;
import lombok.Setter;
import net.jami.datastore.dao.ContactDao;
import net.jami.datastore.dao.DeviceDao;
import net.jami.datastore.dao.SystemDao;
import net.jami.datastore.dao.UserDao;
import net.jami.jams.common.authentication.AuthenticationSource;
import net.jami.jams.common.authentication.AuthenticationSourceInfo;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.dao.connectivity.ConnectionPool;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.common.objects.user.UserProfile;

import java.util.List;

@Getter
@Setter
public class DataStore implements AuthenticationSource {

    public static ConnectionPool connectionPool;
    private UserDao userDao;
    private DeviceDao deviceDao;
    private SystemDao systemDao;
    private ContactDao contactDao;

    //Implicitly connect to debry.
    public DataStore(String connectionString) {
        connectionPool = new ConnectionPool(connectionString);
        userDao = new UserDao();
        deviceDao = new DeviceDao();
        systemDao = new SystemDao();
        contactDao = new ContactDao();
    }

    public boolean userExists(String username){
        StatementList statementList = new StatementList();
        StatementElement statementElement = new StatementElement("username","=",username,"");
        statementList.addStatement(statementElement);
        List<User> userList = userDao.getObjects(statementList);
        return (userList.size() == 1);
    }

    @Override
    public boolean createUser(User user) {
        return userDao.storeObject(user);
    }

    @Override
    public UserProfile[] getUserProfile(String queryString, String field) {
        return null;
    }

    @Override
    public void setUserProfile(UserProfile userProfile) {
        //TODO: Implement this.
    }

    @Override
    public boolean authenticate(String username, String password) {
        StatementList statementList = new StatementList();
        StatementElement statementElement = new StatementElement("username","=",username,"");
        statementList.addStatement(statementElement);
        List<User> userList = userDao.getObjects(statementList);
        if(userList.size() != 1) return false;
        return userList.get(0).getPassword().equals(password);
    }

    @Override
    public AuthenticationSourceInfo getInfo() {
        return new AuthenticationSourceInfo("LOCAL", AuthenticationSourceType.LOCAL);
    }

    @Override
    public boolean test() {
        return true;
    }

    @Override
    public boolean updatePassword(User user, String password) {
        return false;
    }
}
