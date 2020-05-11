package net.jami.datastore.main;

import lombok.Getter;
import lombok.Setter;
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

    //Implicitly connect to debry.
    public DataStore(String connectionString) {
        connectionPool = new ConnectionPool(connectionString);
        userDao = new UserDao();
        deviceDao = new DeviceDao();
        systemDao = new SystemDao();
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
    public boolean testConfiguration(String configuration) {
        return true;
    }

    @Override
    public boolean updatePassword(User user, String password) {
        return false;
    }
}
