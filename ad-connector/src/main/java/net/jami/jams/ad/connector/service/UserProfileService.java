package net.jami.jams.ad.connector.service;

import com.imperva.ddc.core.Connector;
import com.imperva.ddc.core.language.PhraseOperator;
import com.imperva.ddc.core.language.QueryAssembler;
import com.imperva.ddc.core.language.Sentence;
import com.imperva.ddc.core.language.SentenceOperator;
import com.imperva.ddc.core.query.*;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.ad.connector.ADConnector;
import net.jami.jams.common.objects.user.UserProfile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
public class UserProfileService {

    private static final HashMap<String,String> fieldMap = ADConnector.settings.getFieldMappings();

    public UserProfile[] getUserProfile(String queryString, String field){
        Endpoint endpoint = ADConnector.getConnection();
        UserProfile[] profiles = null;
        try{
            QueryRequest queryRequest = buildRequest(endpoint);
            Sentence sentence = null;
            if(field.equals("LOGON_NAME")){
                sentence = new QueryAssembler().addPhrase(FieldType.LOGON_NAME, PhraseOperator.EQUAL, queryString)
                        .closeSentence();
            }
            if(field.equals("FULL_TEXT_NAME")) {
                sentence = new QueryAssembler().addPhrase(FieldType.FIRST_NAME, PhraseOperator.EQUAL, queryString)
                        .addPhrase(FieldType.LAST_NAME, PhraseOperator.EQUAL, queryString)
                        .closeSentence(SentenceOperator.OR);
            }
            queryRequest.addSearchSentence(sentence);
            QueryResponse queryResponse;
            try(Connector connector = new Connector(queryRequest)) {
                queryResponse = connector.execute();
            }
            List<List<Field>> results = queryResponse.getAll().stream().map(EntityResponse::getValue).collect(Collectors.toList());
            if(results.size() > 0) profiles = new UserProfile[results.size()];
            for(int i=0;i< profiles.length; i++){
                profiles[i] = profileFromResponse(results.get(i));
            }
            return profiles;
        }
        catch (Exception e){
            log.error("Could not find entity with specified parameters.");
            return null;
        }
        finally {
            ADConnector.returnConnection(endpoint);
        }
    }


    public static QueryRequest buildRequest(Endpoint endpoint) {
        QueryRequest queryRequest = new QueryRequest();
        queryRequest.setDirectoryType(DirectoryType.MS_ACTIVE_DIRECTORY);
        queryRequest.setEndpoints(new ArrayList<>() {{ add(endpoint);}});
        queryRequest.setSizeLimit(1);
        queryRequest.setTimeLimit(1000);
        queryRequest.setObjectType(ObjectType.USER);
        for(String field : fieldMap.keySet()) queryRequest.addRequestedField(field);
        return queryRequest;
    }

    public static UserProfile profileFromResponse(List<Field> fields){
        //Use reflection to remap.
        try {
            UserProfile userProfile = new UserProfile();
            for (Field field : fields) {
                if(fieldMap.containsKey(field.getName())) {
                    UserProfile.exposedMethods.get("set" + fieldMap.get(field.getName())).invoke(userProfile, field.getValue());
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
