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

package net.jami.datastore.dao;

import lombok.extern.slf4j.Slf4j;

import net.jami.jams.common.objects.user.UserProfile;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
public class UserProfileDao extends AbstractDao<UserProfile> {

    // Fix this to include the fields from AD/LDAP.
    public UserProfileDao() {
        this.setTableName("local_directory");
        this.setTClass(UserProfile.class);
    }

    public void insertIfNotExists(UserProfile userProfile) throws SQLException {
        String query =
                "INSERT INTO local_directory"
                        + " (username, firstName, lastName, email, profilePicture, organization, phoneNumber, phoneNumberExtension, faxNumber, mobileNumber)"
                        + " SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?"
                        + " FROM local_directory"
                        + " WHERE NOT EXISTS (SELECT 1 FROM local_directory WHERE username = ?)";

        List<String> params = new ArrayList<>();
        params.add(userProfile.getUsername());
        params.add(userProfile.getFirstName());
        params.add(userProfile.getLastName());
        params.add(userProfile.getEmail());
        params.add(userProfile.getProfilePicture());
        params.add(userProfile.getOrganization());
        params.add(userProfile.getPhoneNumber());
        params.add(userProfile.getPhoneNumberExtension());
        params.add(userProfile.getFaxNumber());
        params.add(userProfile.getMobileNumber());
        params.add(userProfile.getUsername());

        this.executeUpdate(query, params);
    }

    public List<UserProfile> getAllUserProfile() {
        ResultSet rs = executeQuery("SELECT * FROM local_directory");
        return getObjectsFromResultSet(rs);
    }

    public List<UserProfile> searchUsername(String username) {
        String query = "SELECT * FROM local_directory WHERE username LIKE ?";
        ResultSet rs = executeQuery(query, username + "%");
        return getObjectsFromResultSet(rs);
    }

    public List<UserProfile> searchFullName(String name) {
        String query = "SELECT * FROM local_directory WHERE firstName LIKE ? OR lastName LIKE ?";
        name = name + "%";
        ResultSet rs = executeQuery(query, List.of(name, name));
        return getObjectsFromResultSet(rs);
    }

    public Optional<UserProfile> getByUsername(String username) {
        ResultSet rs = executeQuery("SELECT * FROM local_directory WHERE username = ?", username);
        return getFirstObjectFromResultSet(rs);
    }

    @Override
    public boolean storeObject(UserProfile object) {
        String query =
                "INSERT INTO local_directory "
                        + "(firstName, lastName, email, profilePicture, organization, phoneNumber, phoneNumberExtension, faxNumber, mobileNumber, username)"
                        + " VALUES "
                        + "(?,?,?,?,?,?,?,?,?,?)";
        return executeInsert(query, object);
    }

    public boolean updateUserProfile(UserProfile userProfile) {
        String query =
                "UPDATE local_directory SET"
                        + " firstname = ?,"
                        + " lastName = ?,"
                        + " email = ?,"
                        + " profilePicture = ?,"
                        + " organization = ?,"
                        + " phoneNumber = ?,"
                        + " phoneNumberExtension = ?,"
                        + " faxNumber = ?,"
                        + " mobileNumber = ?"
                        + " WHERE username = ?";
        return executeInsert(query, userProfile);
    }
}
