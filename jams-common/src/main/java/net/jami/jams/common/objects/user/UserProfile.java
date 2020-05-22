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
package net.jami.jams.common.objects.user;

import lombok.Getter;
import lombok.Setter;

import java.lang.reflect.Method;
import java.util.HashMap;

@Getter
@Setter
public class UserProfile {

    public static HashMap<String, Method> exposedMethods = new HashMap<>();

    static {
        for (Method method : UserProfile.class.getMethods()) {
            exposedMethods.put(method.getName(), method);
        }
    }

    //We sort of need the username here, because it's our only way of creating users which never existed.
    private String username;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String phoneNumberExtension;
    private String mobileNumber;
    private String faxNumber;
    private String profilePicture;
    private String email;
    private String organization;


}
