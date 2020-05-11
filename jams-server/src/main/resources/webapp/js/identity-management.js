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
    var inputs = {
        "CN": "http://ns.jami.net"
    };
    var data = inputs;
    postParamaters(data);
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
  var inputs = {}
  $.each(($(form).serializeArray()), function (i, field){
      if (field.name == 'useStartTLS')
          inputs[field.name] = $.parseJSON(field.value);
      else
          inputs[field.name] = field.value;
  });
  var data = inputs;
  // post request
  postParamaters(data);
}

function setADParametersData(form) {
    var inputs = {}
    $.each(($(form).serializeArray()), function (i, field){
        if (field.name == 'port')
            inputs[field.name] = parseInt(field.value);
        else if (field.name == 'isSSL')
            inputs[field.name] = $.parseJSON(field.value);
        else
            inputs[field.name] = field.value;
    });
    var data = inputs;
    // post request
    postParamaters(data);
}

// send post request
function postParamaters(data) {
  usePublicNS = $('#publicNS')[0].checked;
  var callback = set_installation_response("server-parameters.html" + "?usePublicNS=" + usePublicNS);

  ajaxApiCall(api_path_post_install_auth,'POST',data,null,callback);
}

// show tooltip
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
