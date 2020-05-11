package net.jami.jams.ldap.connector.service;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.objects.user.UserProfile;
import net.jami.jams.ldap.connector.LDAPConnector;
import org.ldaptive.*;

import java.util.HashMap;

@Slf4j
public class UserProfileService {

    private static final HashMap<String,String> fieldMap = new HashMap<>();
    private final ConnectionFactory connectionFactory;

    static{
        fieldMap.put("givenName","FirstName");
        fieldMap.put("sn","LastName");
        fieldMap.put("jpegPhoto","ProfilePicture");
        fieldMap.put("mail","Email");
        fieldMap.put("telephoneNumber","PhoneNumber");
        fieldMap.put("mobile","MobileNumber");
        fieldMap.put("facsimileTelephoneNumber","FaxNumber");
        fieldMap.put("extensionName","PhoneNumberExtension");
        fieldMap.put("o","Organization");
    }

    public UserProfileService(ConnectionFactory connectionFactory) {
        this.connectionFactory = connectionFactory;
    }

    public UserProfile getUserProfile(String queryString, String field){
        Connection connection = null;
        try {
            connection = connectionFactory.getConnection();
            try {
                connection.open();
                SearchOperation search = new SearchOperation(connectionFactory);
                SearchResponse res = search.execute(buildRequest(queryString,field));
                if (res.getEntries().size() > 0) return profileFromResponse(res.getEntry());
                return null;
            } catch (Exception e) {
                log.error("Could not search LDAP directory with error " + e.toString());
                return null;
            }
        }
        catch (Exception e){
            log.info("Failed to search LDAP directory with error " + e.toString());
            return null;
        }
        finally {
            connection.close();
        }
    }


    public static SearchRequest buildRequest(String queryString, String field) {
        if(field.equals("LOGON_NAME")) {
            return SearchRequest.builder()
                    .dn(LDAPConnector.settings.getBaseDN())
                    .filter("(&("+LDAPConnector.settings.getUsernameField()+"=" + queryString + "))")
                    .build();
        }
        if(field.equals("FULL_TEXT_NAME")){
            return SearchRequest.builder()
                    .dn(LDAPConnector.settings.getBaseDN())
                    .filter("(|(givenName=" + queryString + ")(sn="+queryString+")")
                    .build();
        }
        return null;
    }

    public static UserProfile profileFromResponse(LdapEntry entry){
        //Use reflection to remap.
        try {
            UserProfile userProfile = new UserProfile();
            for (String attribute : entry.getAttributeNames()) {
                if(fieldMap.containsKey(attribute)) {
                    UserProfile.exposedMethods.get("set" + fieldMap.get(attribute)).invoke(userProfile, entry.getAttribute(attribute).getStringValue());
                }
            }
            return userProfile;
        }
        catch (Exception e){
            log.error("An error occured while trying to invoke methods: " + e.toString());
            return null;
        }
    }
}
