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
import net.jami.datastore.dao.JwtDao;
import net.jami.datastore.dao.SystemDao;
import net.jami.datastore.dao.UserDao;
import net.jami.datastore.dao.UserProfileDao;
import net.jami.jams.common.authentication.AuthenticationSource;
import net.jami.jams.common.authentication.AuthenticationSourceInfo;
import net.jami.jams.common.authentication.AuthenticationSourceType;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.dao.connectivity.ConnectionPool;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.common.objects.user.UserProfile;
import org.flywaydb.core.Flyway;

import java.util.List;

@Getter
@Setter
public class DataStore implements AuthenticationSource {

    public static ConnectionPool connectionPool;
    private UserDao userDao;
    private DeviceDao deviceDao;
    private SystemDao systemDao;
    private ContactDao contactDao;
    private JwtDao jwtDao;
    private UserProfileDao userProfileDao;

    //Implicitly connect to derby.
    public DataStore(String connectionString) {
        Flyway flyway = Flyway.configure().dataSource(connectionString,"", "").load();
        flyway.migrate();
        connectionPool = new ConnectionPool(connectionString);
        userDao = new UserDao();
        deviceDao = new DeviceDao();
        systemDao = new SystemDao();
        contactDao = new ContactDao();
        jwtDao = new JwtDao();
        userProfileDao = new UserProfileDao();
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
    public List<UserProfile> searchUserProfiles(String queryString, String field) {
        List<UserProfile> userList;

        if (!queryString.equals("*")) {
            StatementList statementList = new StatementList();
            String startQueryString = queryString.concat("%");
            if(field.equals("LOGON_NAME")){
                statementList.addStatement(new StatementElement("username","LIKE", startQueryString,""));
            }
            else if(field.equals("FULL_TEXT_NAME")){
                statementList.addStatement(new StatementElement("firstName","LIKE", startQueryString,"OR"));
                statementList.addStatement(new StatementElement("lastName","LIKE", startQueryString, ""));
            }
            userList = userProfileDao.getObjects(statementList);
        } else
            userList = userProfileDao.getObjects(null);

        return userList;
    }

    @Override
    public UserProfile getUserProfile(String username) {
        StatementList statementList = new StatementList();
        statementList.addStatement(new StatementElement("username","=", username,""));
        List<UserProfile> userList = userProfileDao.getObjects(statementList);
        if(userList.size() != 1) return null;
        else return userList.get(0);
    }

    @Override
    public boolean setUserProfile(UserProfile userProfile) {
        return userProfileDao.storeObject(userProfile);
    }

    public boolean updateUserProfile(UserProfile userProfile){

        StatementList update = new StatementList();
        update.addStatement(new StatementElement("username","=",userProfile.getUsername(),""));
        update.addStatement(new StatementElement("firstName","=",userProfile.getFirstName(),""));
        update.addStatement(new StatementElement("lastName","=",userProfile.getLastName(),""));
        update.addStatement(new StatementElement("email","=",userProfile.getEmail(),""));
        update.addStatement(new StatementElement("profilePicture","=",userProfile.getProfilePicture(),""));
        update.addStatement(new StatementElement("organization","=",userProfile.getOrganization(),""));
        update.addStatement(new StatementElement("phoneNumber","=",userProfile.getPhoneNumber(),""));
        update.addStatement(new StatementElement("phoneNumberExtension","=",userProfile.getPhoneNumberExtension(),""));
        update.addStatement(new StatementElement("faxNumber","=",userProfile.getFaxNumber(),""));
        update.addStatement(new StatementElement("mobileNumber","=",userProfile.getMobileNumber(),""));

        return userProfileDao.updateObject(update, null);
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
