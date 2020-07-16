package net.jami.jams.server.core.workflows;


import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.user.Group;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.common.objects.user.UserGroupMapping;
import net.jami.jams.common.objects.user.UserProfile;
import net.minidev.json.JSONArray;

import java.util.ArrayList;
import java.util.List;

import static net.jami.jams.server.Server.dataStore;
import static net.jami.jams.server.Server.userAuthenticationModule;

@Slf4j
public class AddUserToGroupFlow {

    public static void addUserToGroup(String groupName, String username) {

        try {

            userAuthenticationModule.getAuthSources().forEach((k, v) -> {
                        List<UserProfile> profiles = v.searchUserProfiles(username, "LOGON_NAME");
                        if (!profiles.isEmpty()) {
                            UserProfile profile = profiles.get(0);
                            StatementList statementList = new StatementList();
                            statementList.addStatement(new StatementElement("name", "=", username, ""));

                            if (profile != null) {
                                if (profile.getGroupMemberships() == null)
                                    profile.setGroupMemberships(new ArrayList<>());
                                profile.getGroupMemberships().add(groupName);
                            }

                            statementList = new StatementList();
                            statementList.addStatement(new StatementElement("username", "=", username, ""));
                            if (dataStore.getUserGroupMappingsDao().getObjects(statementList).isEmpty()) {
                                // if the mapping doesn't exist, create it and add the group directly.
                                UserGroupMapping newMapping = new UserGroupMapping();
                                newMapping.setUsername(username);
                                newMapping.setGroups("");
                                newMapping.addGroup(groupName);
                                dataStore.getUserGroupMappingsDao().storeObject(newMapping);
                            } else {
                                // otherwise, update the object.

                                UserGroupMapping mapping = dataStore.getUserGroupMappingsDao().getObjects(statementList).get(0);
                                mapping.addGroup(groupName);
                                String newGroups = mapping.getGroups();

                                StatementList update = new StatementList();
                                StatementElement st0 = new StatementElement("groups","=", newGroups,"");
                                update.addStatement(st0);
                                StatementList constraint = new StatementList();
                                StatementElement st1 = new StatementElement("username","=",username,"");
                                constraint.addStatement(st1);
                                dataStore.getUserGroupMappingsDao().updateObject(update, constraint);
                            }
                        }
            });





        } catch (Exception e) {
            log.error("An error occurred while attempting to add " + username + " to group with name " + groupName);
        }

    }
}
