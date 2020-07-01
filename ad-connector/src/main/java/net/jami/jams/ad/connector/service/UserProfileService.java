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

package net.jami.jams.ad.connector.service;

import com.imperva.ddc.core.Connector;
import com.imperva.ddc.core.language.PhraseOperator;
import com.imperva.ddc.core.language.QueryAssembler;
import com.imperva.ddc.core.language.Sentence;
import com.imperva.ddc.core.language.SentenceOperator;
import com.imperva.ddc.core.query.DirectoryType;
import com.imperva.ddc.core.query.Endpoint;
import com.imperva.ddc.core.query.EntityResponse;
import com.imperva.ddc.core.query.Field;
import com.imperva.ddc.core.query.FieldType;
import com.imperva.ddc.core.query.ObjectType;
import com.imperva.ddc.core.query.QueryRequest;
import com.imperva.ddc.core.query.QueryResponse;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.ad.connector.ADConnector;
import net.jami.jams.common.objects.user.UserProfile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
public class UserProfileService {

    private static final HashMap<String, String> fieldMap = ADConnector.settings.getFieldMappings();

    public UserProfile[] getUserProfile(String queryString, String field) {
        Endpoint endpoint = ADConnector.getConnection();
        UserProfile[] profiles = null;
        if (!queryString.startsWith("*")) {
            queryString = queryString.concat("*");
        }
        try {
            QueryRequest queryRequest = buildRequest(endpoint);
            Sentence sentence = null;
            if (queryString.contains("*")) {
                sentence = new QueryAssembler().addPhrase(FieldType.OBJECT_CLASS, PhraseOperator.EQUAL, ObjectType.USER.toString()).closeSentence();
            } else {
                if (field.equals("LOGON_NAME")) {
                    sentence = new QueryAssembler().addPhrase(FieldType.LOGON_NAME, PhraseOperator.CONTAINS, queryString)
                        .closeSentence();
                }
                if (field.equals("FULL_TEXT_NAME")) {
                    sentence = new QueryAssembler().addPhrase(FieldType.FIRST_NAME, PhraseOperator.CONTAINS, queryString)
                        .addPhrase(FieldType.LAST_NAME, PhraseOperator.CONTAINS, queryString)
                        .closeSentence(SentenceOperator.OR);
                }
            }
            queryRequest.addSearchSentence(sentence);
            QueryResponse queryResponse;
            try (Connector connector = new Connector(queryRequest)) {
                queryResponse = connector.execute();
            }
            List<List<Field>> results = queryResponse.getAll().stream().map(EntityResponse::getValue).collect(Collectors.toList());
            if (results.size() > 0) {
                profiles = new UserProfile[results.size()];
            } else {
                return null;
            }
            for (int i = 0; i < profiles.length; i++) {
                profiles[i] = profileFromResponse(results.get(i));
            }
            return profiles;
        } catch (Exception e) {
            log.error("Could not find entity with specified parameters.");
            return null;
        } finally {
            ADConnector.returnConnection(endpoint);
        }
    }

    public static QueryRequest buildRequest(Endpoint endpoint) {
        QueryRequest queryRequest = new QueryRequest();
        queryRequest.setDirectoryType(DirectoryType.MS_ACTIVE_DIRECTORY);
        queryRequest.setEndpoints(new ArrayList<>() {{
            add(endpoint);
        }});
        queryRequest.setSizeLimit(1000);
        queryRequest.setTimeLimit(1000);
        queryRequest.setObjectType(ObjectType.USER);
        for (String field : fieldMap.keySet()) {
            queryRequest.addRequestedField(field);
        }
        return queryRequest;
    }

    public static UserProfile profileFromResponse(List<Field> fields) {
        //Use reflection to remap.
        try {
            UserProfile userProfile = new UserProfile();
            for (Field field : fields) {
                if (fieldMap.containsKey(field.getName())) {
                    UserProfile.exposedMethods.get("set" + fieldMap.get(field.getName())).invoke(userProfile, field.getValue());
                }
            }
            return userProfile;
        } catch (Exception e) {
            log.error("An error occured while trying to invoke methods: " + e.toString());
            return null;
        }
    }
}
