package net.jami.jams.ldap.connector.service;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.objects.user.UserProfile;
import net.jami.jams.ldap.connector.LDAPConnector;
import org.ldaptive.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Iterator;

@Slf4j
public class UserProfileService {

    private static final HashMap<String,String> fieldMap = LDAPConnector.settings.getFieldMappings();
    private final ConnectionFactory connectionFactory;

    public UserProfileService(ConnectionFactory connectionFactory) {
        this.connectionFactory = connectionFactory;
    }

    public UserProfile[] getUserProfile(String queryString, String field){
        UserProfile[] profiles = null;
        Connection connection = null;
        try {
            queryString = URLEncoder.encode(queryString,StandardCharsets.UTF_8).replace("%","\\");
            connection = connectionFactory.getConnection();
            try {
                connection.open();
                SearchOperation search = new SearchOperation(connectionFactory);
                SearchResponse res = search.execute(buildRequest(queryString,field));
                if (res.getEntries().size() > 0) profiles = new UserProfile[res.getEntries().size()];
                else return null;
                Iterator<LdapEntry> iterator = res.getEntries().iterator();
                int i = 0;
                while(iterator.hasNext()){
                    profiles[i] = profileFromResponse(iterator.next());
                    i++;
                }
                return profiles;
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
