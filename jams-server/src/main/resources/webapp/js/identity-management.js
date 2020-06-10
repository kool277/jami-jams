/*
 *     JAMS - Jami Account Management Server
 *     Copyright (C) 2019 Savoir-faire Linux Inc.
 *
 *     Author: Mohammed Raza <mohammed.raza@savoirfairelinux.com>
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

var usePublicNS = false;

$("#inputIdentityManagmentType").change(function () {
    $("#" + $(this).val()).show().siblings().hide();
})

// Embedded
$("#HSQL-form").submit(function (event) {
    event.preventDefault();
    var authSource = {};
    var settings = {
        "publicNameServer": "http://ns.jami.net",
        "publicNames": $('#publicNS')[0].checked
    };

    authSource['type'] = 'LOCAL';
    authSource['localAuthSettings'] = settings;
    var data = authSource;
    // post request
    postParameters(data);
});

// LDAP
$("#LDAP-form").submit(function (event) {
    event.preventDefault();
    setLDAPParametersData($(this));
});

// Active Directory
$("#AD-form").submit(function (event) {
    event.preventDefault();
    setADParametersData($(this));
});

function setLDAPParametersData(form) {
  var authSource = {};
  var settings = {};
  $.each(($(form).serializeArray()), function (i, field){
      if (field.name == 'useStartTLS')
          settings[field.name] = $.parseJSON(field.value);
      else
          settings[field.name] = field.value;
  });
  settings['fieldMappings'] = {};
  settings['fieldMappings']['givenName'] = "FirstName";
  settings['fieldMappings']['sn'] = "LastName";
  settings['fieldMappings']['jpegPhoto'] = "ProfilePicture";
  settings['fieldMappings']['mail'] = "Email";
  settings['fieldMappings']['telephoneNumber'] = "PhoneNumber";
  settings['fieldMappings']['mobile'] = "MobileNumber";
  settings['fieldMappings']['facsimileTelephoneNumber'] = "FaxNumber";
  settings['fieldMappings']['extensionName'] = "PhoneNumberExtension";
  settings['fieldMappings']['o'] = "Organization";
  settings['fieldMappings']['uid'] = "Username";

  authSource['type'] = 'LDAP';
  authSource['ldapSettings'] = settings;
  var data = authSource;
  // post request
    postParameters(data);
}

function setADParametersData(form) {
    var authSource = {};
    var settings = {};
    $.each(($(form).serializeArray()), function (i, field){
        if (field.name == 'port')
            settings[field.name] = parseInt(field.value);
        else if (field.name == 'isSSL')
            settings[field.name] = $.parseJSON(field.value);
        else
            settings[field.name] = field.value;
    });

    settings['fieldMappings'] = {};
    settings['fieldMappings']['givenName'] = "FirstName";
    settings['fieldMappings']['sn'] = "LastName";
    settings['fieldMappings']['jpegPhoto'] = "ProfilePicture";
    settings['fieldMappings']['mail'] = "Email";
    settings['fieldMappings']['telephoneNumber'] = "PhoneNumber";
    settings['fieldMappings']['mobile'] = "MobileNumber";
    settings['fieldMappings']['facsimileTelephoneNumber'] = "FaxNumber";
    settings['fieldMappings']['extensionName'] = "PhoneNumberExtension";
    settings['fieldMappings']['o'] = "Organization";
    settings['fieldMappings']['uid'] = "Username";

    authSource['type'] = 'AD';
    authSource['activeDirectorySettings'] = settings;
    var data = authSource;
    // post request
    postParameters(data);
}

// send post request
function postParameters(data) {
  usePublicNS = $('#publicNS')[0].checked;
  var callback = set_installation_response("server-parameters.html" + "?usePublicNS=" + usePublicNS);

  ajaxApiCall(api_path_post_install_auth,'POST',data,null,callback);
}

// show tooltip
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
