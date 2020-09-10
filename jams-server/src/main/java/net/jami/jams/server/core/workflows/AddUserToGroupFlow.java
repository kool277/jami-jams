package net.jami.jams.server.core.workflows;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.user.UserGroupMapping;
import net.jami.jams.common.objects.user.UserProfile;

import java.util.ArrayList;
import java.util.List;

import static net.jami.jams.server.Server.dataStore;
import static net.jami.jams.server.Server.userAuthenticationModule;

@Slf4j
public class AddUserToGroupFlow {

    public static void addUserToGroup(String groupName, String username) {
        userAuthenticationModule.getAuthSources().forEach((k, v) -> {
            UserProfile profile = v.getUserProfile(username);
            List<UserProfile> groupProfiles = v.searchUserProfiles(username, "LOGON_NAME");
            if (!groupProfiles.isEmpty()) {
                UserGroupMapping mapping = null;
                StatementList statementList = new StatementList();
                statementList.addStatement(new StatementElement("username", "=", username, ""));
                if (dataStore.getUserGroupMappingsDao().getObjects(statementList).isEmpty()) {
                    // if the mapping doesn't exist, create it and add the group directly.

                    try {
                        mapping = new UserGroupMapping();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    mapping.setUsername(username);
                    mapping.setGroups("");
                    mapping.addGroup(groupName);
                    dataStore.getUserGroupMappingsDao().storeObject(mapping);

                } else {
                    // otherwise, update the object.

                    mapping = dataStore.getUserGroupMappingsDao().getObjects(statementList).get(0);
                    mapping.addGroup(groupName);
                    String newGroups = mapping.getGroups();

                    StatementList update = new StatementList();
                    StatementElement st0 = new StatementElement("groups", "=", newGroups, "");
                    update.addStatement(st0);
                    StatementList constraint = new StatementList();
                    StatementElement st1 = new StatementElement("username", "=", username, "");
                    constraint.addStatement(st1);
                    dataStore.getUserGroupMappingsDao().updateObject(update, constraint);
                }

                if (profile != null) {
                    if (profile.getGroupMemberships() == null)
                        profile.setGroupMemberships(new ArrayList<>());
                    profile.getGroupMemberships().add(groupName);
                    dataStore.updateUserProfile(profile);
                }
            }
        });
    }
}
