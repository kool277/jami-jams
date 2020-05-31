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

import com.jsoniter.annotation.JsonIgnore;
import ezvcard.Ezvcard;
import ezvcard.VCard;
import ezvcard.VCardVersion;
import ezvcard.parameter.EmailType;
import ezvcard.parameter.ImageType;
import ezvcard.parameter.TelephoneType;
import ezvcard.property.Organization;
import ezvcard.property.Photo;
import ezvcard.property.StructuredName;
import ezvcard.property.Telephone;
import lombok.Getter;
import lombok.Setter;
import org.bouncycastle.util.encoders.Base64;

import java.lang.reflect.Method;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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

    @JsonIgnore
    //Ignore this if we pass through JSON iterator.
    public String getAsVCard(){
        VCard vCard = new VCard();

        //We assume these always exist...
        StructuredName structuredName = new StructuredName();
        structuredName.setFamily(URLEncoder.encode(this.getLastName(), StandardCharsets.UTF_8));
        structuredName.setGiven(URLEncoder.encode(this.getFirstName(), StandardCharsets.UTF_8));
        vCard.setStructuredName(structuredName);

        if(this.getPhoneNumber() != null) vCard.addTelephoneNumber(this.getPhoneNumber(), TelephoneType.WORK);
        if(this.getMobileNumber() != null) vCard.addTelephoneNumber(this.getMobileNumber(),TelephoneType.CELL);
        if(this.getFaxNumber() != null) vCard.addTelephoneNumber(this.getFaxNumber(), TelephoneType.FAX);
        if(this.getEmail() != null) vCard.addEmail(this.getEmail(), EmailType.WORK);
        if(this.getOrganization() != null) vCard.setOrganization(this.getOrganization());

        /*I think this is how Base64 will work in this case*/
        if(this.getProfilePicture() != null) {
            Photo photo = new Photo(Base64.decode(this.getProfilePicture()), ImageType.JPEG);
            vCard.addPhoto(photo);
        }

        return Ezvcard.write(vCard).version(VCardVersion.V3_0).go();
    }

}
