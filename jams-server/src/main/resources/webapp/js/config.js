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

// declaring variables
var selected_names = ['useStartTLS', 'usernameField', 'sSL'];
var type_int_name_input = ['deviceValidity', 'userValidity'];
var auth_action = null;
var auth_type = null;

// get all configurations
ajaxApiCall(api_path_get_post_configuration_global_settings,'GET',null,null,getAllConfigurations);

// get all configurations callBackFunction
function getAllConfigurations(data, statusCode, jqXHR) {
  if (jqXHR.status == 200 && data.length != 0) {
    var domain = data.domain;
    var crlValidity = data.crlValidity;
    var deviceValidity = data.deviceValidity;
    var userValidity = data.userValidity;
    var ldapConfigurations = data.ldapConfigurations;
    var adConfigurations = data.activeDirectoryConfgurations;
    setADblocks(adConfigurations);
    setLDAPblocks(ldapConfigurations);
    setServerParameters(domain,crlValidity,deviceValidity,userValidity);
    $('[data-toggle="tooltip"]').tooltip();
    if(sessionStorage.getItem("auth_added") !== ""){
      var msg = sessionStorage.getItem("auth_added");
      // $('.addAuthWrapper').before('<div class="configMessage" id="configMessageSuccess"><i class="fa fa-check-circle" aria-hidden="true"></i>' + msg + '</div>');
      sessionStorage.setItem("auth_added", "")
    }
  }
}

$(document).ready(function () {
    $('#sipFile').change(function (event) {
        var name = readSingleFile(event, '#sipContents');
        $('.custom-file-label').text(name)
    });
});

/*======== LDAP =============*/

// display add LDAP template form
$('#addAuthenticationLDAP').on('click', function () {
  $('#LDAP-form-submit').text('Create LDAP authentication service');
  $('#LDAPModalCenter').modal('show');
  $("#LDAP-form")[0].reset();
});

// submit create/edit LDAP authentication
$(document).on("submit","#LDAP-form",function (e) {
  console.log("submit LDAP form");
  e.preventDefault();
  setLDAPparametersData($(this));
});

function setLDAPparametersData(form) {
  var inputs = {}
  $.each(($(form).serializeArray()), function (i, field) {
    if (field.name == 'useStartTLS')
      inputs[field.name] = $.parseJSON(field.value);
    else
      inputs[field.name] = field.value;
  });
  var data = inputs;
  // edit post request
  if (data['configId']) {
    ajaxApiCall(api_path_get_post_configuration_auth_service,'POST', data, null, callbackAuthentication);
  }
  // create post request
  else {
    delete data['configId'];
    auth_type = "LDAP"
    auth_action = "CREATE"
    ajaxApiCall(api_path_get_post_configuration_auth_service,'POST', data, null, callbackAuthentication);
  }
}

// set LDAP configruation blocks
function setLDAPblocks(ldap_list) {
  $.each(ldap_list, function (index, ldap) {
    // set the display values
    var ldap_template = $($('#ldapTemplate').html());
    var $new_ldap = ldap_template.clone();
    $.each(ldap, function (name, value) {
      populateTemplate($new_ldap, name, value);
    });
    $new_ldap.find('.label-title').html("LDAP Authentication");
    var edit_button = $new_ldap.find('.edit-auth').attr('data-id', ldap['configId']);
    var delete_button = $new_ldap.find('.delete-auth').attr('data-id', ldap['configId']);
    $(edit_button).on( 'click', editAuthorizationLDAP);
    $(delete_button).on( 'click', deleteAuthorization);
    $new_ldap.find('.authentication-data-ldap').attr('data-configId', ldap['configId'])
    $new_ldap.insertAfter('#authDataWrapper');
  });
}

/*======== ACTIVE DIRECTORY =============*/

// display add AD template form
$('#addAuthenticationAD').on('click', function () {
  $('#AD-form-submit').text('Create active directory authentication service');
  $('#ADModalCenter').modal('show');
  $("#AD-form")[0].reset();
});

// submit create/edit AD authentication
$(document).on("submit","#AD-form",function (e) {
  console.log("submit AD form");
  e.preventDefault();
  setADparametersData($(this));
});

function setADparametersData(form) {
  var inputs = {}
  $.each(($(form).serializeArray()), function (i, field) {
    if (field.name == 'sSL') {
      inputs[field.name] = $.parseJSON(field.value);
    }
    else if(field.name == 'port') {
      inputs[field.name] = parseInt(field.value);
    }
    else {
      inputs[field.name] = field.value;
    }
  });
  var data = inputs;
  // edit post request
  if (data['configId']) {
    ajaxApiCall(api_path_get_post_configuration_auth_service,'POST', data, null, callbackAuthentication);
  }
  // create post request
  else {
    delete data['configId'];
    auth_type = "AD"
    auth_action = "CREATE"
    ajaxApiCall(api_path_get_post_configuration_auth_service,'POST', data, null, callbackAuthentication);
  }
}

// set LDAP configruation blocks
function setADblocks(ad_list) {
  $.each(ad_list, function (index, ad) {
    // set the display values
    var ad_template = $($('#adTemplate').html());
    var $new_ad = ad_template.clone();
    $.each(ad, function (name, value) {
      populateTemplate($new_ad, name, value);
    });
    $new_ad.find('.label-title').html("Active Directory Authentication");
    var edit_button = $new_ad.find('.edit-auth').attr('data-id', ad['configId']);
    var delete_button = $new_ad.find('.delete-auth').attr('data-id', ad['configId']);
    $(edit_button).on( 'click', editAuthorizationAD);
    $(delete_button).on( 'click', deleteAuthorization);
    $new_ad.find('.authentication-data-ad').attr('data-configId', ad['configId'])
    $new_ad.insertAfter('#authDataWrapper');
  });
}

/*======== SERVER PARAMETERS =============*/

// submit edit serverParameters
$("#form-server-parameters").submit(function(event) {
  console.log("submit form-server-parameters");
  event.preventDefault();
  setServerParametersData($(this));
});

// setServerParameters configruation block
function setServerParameters(domain,crlValidity,deviceValidity,userValidity) {
  $('input[name="domain"]').val(domain);
  $("option[value='" + deviceValidity + "']", "select[name='deviceValidity']").prop('selected', true);
  $("#deviceValidity").data('selectpicker').refresh();
  $("option[value='" + crlValidity + "']", "select[name='crlValidity']").prop('selected', true);
  $("#crlValidity").data('selectpicker').refresh();
  $("option[value='" + userValidity + "']", "select[name='userValidity']").prop('selected', true);
  $("#userValidity").data('selectpicker').refresh();
}

// build server parameters json object
function setServerParametersData(form) {
    var parameters_data = {
        'settings': {
        }
    }

  $.each($(form).serializeArray(), function (i, field) {
    if (type_int_name_input.indexOf(field.name) >= 0) {
      parameters_data['settings'][field.name] = parseInt(field.value);
    }
    else {

        if (field.name != 'sipConfig')
            parameters_data['settings'][field.name] = field.value;
        else if ($('#sipContents').val() != "")
            parameters_data['settings']['sipConfig'] = $('#sipContents').val();
    }
  });

  // send parameters via POST request
  postServerParameters(parameters_data)
}

// send serverParameters AJAX request
function postServerParameters(data) {
  $('.loading').show();
  setTimeout(function() {
    $('.loading').hide();
    ajaxApiCall(api_path_get_post_configuration_global_settings,'POST',data,null,serverParametersHandler);
  }, 1500);
}

// server parameters callBackFunction
function serverParametersHandler(data, statusCode, jqXHR) {
  if (data.status == 200) {
    $('.configMessage').remove();
    $('#serverParametersTitle').before('<div class="configMessage" id="configMessageSuccess"><i class="fa fa-check-circle" aria-hidden="true"></i>Server parameters successfully updated.</div>');
  }
  else {
    $('.configMessage').remove();
    $('#serverParametersTitle').before('<div class="configMessage" id="configMessageError"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>An error has occured, please try again...</div>');
  }
}

/*======== ADMIN =============*/

// change admin password submit
$("#form-change-password").submit(function (event) {
  event.preventDefault();
  var oldPassword = $('#inputCurrentPassword').val();
  var newPassword = $('#inputNewPassword').val();
  var inputConfirmPassword = $('#inputConfirmPassword').val();
  $('.loading').show();
  setTimeout(function() {
    $('.loading').hide();
    if (oldPassword == newPassword ) {
      $('.configMessage').remove();
      $('#changePasswordTitle').before('<div class="configMessage" id="configMessageError"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>New password must be different from the current password.</div>');
    }
    else if (newPassword == inputConfirmPassword && oldPassword != null) {
      jsonData = {
        "oldPassword": oldPassword,
        "newPassword": newPassword
      }
      ajaxApiCall(api_path_post_configuration_change_password, 'POST', jsonData, null, changePasswordHandler, null);
    }
    else {
      $('.configMessage').remove();
      $('#changePasswordTitle').before('<div class="configMessage" id="configMessageError"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>New password and confirmation password do not match.</div>');
    }
  }, 1500)
});

// handle changePassword callBackFunction
function changePasswordHandler(data, statusCode, jqXHR) {
  if (data.status == 200) {
    $('.configMessage').remove();
    $('#changePasswordTitle').before('<div class="configMessage" id="configMessageSuccess"><i class="fa fa-check-circle" aria-hidden="true"></i>Password successfully updated.</div>');
  }
  else {
    $('.configMessage').remove();
    $('#changePasswordTitle').before('<div class="configMessage" id="configMessageError"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>Current password is incorrect.</div>');
  }
}

/*======== LICENSE REGISTRATION =============*/


// register Jams license submit
$("#form-register-license").submit(function (event) {
    event.preventDefault();
    var base64License = $('#inputLicense').val();
    $('.loading').show();
    setTimeout(function() {
        $('.loading').hide();
        if (base64License != "") {
            jsonData = {
                "base64License": base64License
            }
            ajaxApiCall(api_path_post_configuration_register_license, 'POST', jsonData, null, registerLicenseHandler, null);
        }
        else {
            $('.configMessage').remove();
            $('#changePasswordTitle').before('<div class="configMessage" id="configMessageError"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>New password and confirmation password do not match.</div>');
        }
    }, 1500)
});

// handle changePassword callBackFunction
function registerLicenseHandler(data, statusCode, jqXHR) {
    if (data.status == 200) {
        $('.configMessage').remove();
        $('#changeLicense').before('<div class="configMessage" id="configMessageSuccess"><i class="fa fa-check-circle" aria-hidden="true"></i>Subscription activated!</div>');
    }
    else {
        $('.configMessage').remove();
        $('#changeLicense').before('<div class="configMessage" id="configMessageError"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>Error occurred when attempting to activate your subscription.</div>');
    }
}

/*======== HELPERS =============*/

// delete authentication service
$(document).on("click","#delete-auth-service-confirm",function (e) {
  var configId = $(this)[0].dataset.configid;
  deleteAuthService(configId);
});

// prefill data into the template
function populateTemplate($template, name, value) {
  if (name == 'password') {
    var password_input = $template.find('input[data-name="password"]');
    password_input.val(value);
  }
  else {
    var div = $template.find('[data-name="' + name + '"]');
    if (div) {
      div.text(value);
    }
  }
}

// getting the values from the card and inserting them into the LDAP form
function editAuthorizationLDAP () {
  var auth_id = $(this).attr('data-id');
  var data = $('[data-configId="' + auth_id + '"]');
  var value = '';
  var form = $('#' + $(data).attr('data-authentication-type') + "-form");
  $.each($(form).serializeArray(), function (i, field) {
    const data_name = '[data-name="' + field.name + '"]';
    if (field.name == 'password') {
      value = $(data_name, data).val();
    }
    else if (field.name == 'configId') {
      value = auth_id;
    }
    else {
      value = $(data_name, data).text();
    }
    // pre fill fields
    if (selected_names.indexOf(field.name) >= 0) {
      $("option[value='" + value + "']", "#LDAP-form").prop('selected', true);
      $("#usernameField").data('selectpicker').refresh();
    }
    else {
      $("input[name='" + field.name + "']", "#LDAP-form").val(value);
    }
});
  // set value for radio button
  var useStartTLS_value = $('[data-name="useStartTLS"]', data).text()
  $("input[name='useStartTLS'][value='" + useStartTLS_value + "'", '#LDAP-form').attr("checked", "checked");
  $('#LDAP-form-submit').text('Update LDAP authentication service');
  $('#LDAPModalCenter').modal('show');
}

// getting the values from the card and inserting them into the AD form
function editAuthorizationAD () {
  var auth_id = $(this).attr('data-id');
  var data = $('[data-configId="' + auth_id + '"]');
  var value = '';
  var form = $('#' + $(data).attr('data-authentication-type') + "-form");
  $.each($(form).serializeArray(), function (i, field) {
    const data_name = '[data-name="' + field.name + '"]';
    if (field.name == 'password') {
      value = $(data_name, data).val();
    }
    else if (field.name == 'configId') {
      value = auth_id;
    }
    else {
      value = $(data_name, data).text();
    }
    // pre fill fields
    if (selected_names.indexOf(field.name) >= 0) {
      $("option[value='" + value + "']", "#AD-form").prop('selected', true);
    }
    else {
      $("input[name='" + field.name + "']", "#AD-form").val(value);
    }
  });
  // set value for radio button
  var sSL_value = $('[data-name="sSL"]', data).text()
  $("input[name='sSL'][value='" + sSL_value + "'", '#AD-form').attr("checked", "checked");
  $('#AD-form-submit').text('Update active directory authentication service');
  $('#ADModalCenter').modal('show');
}

// handles authentication delete modal behaviour
function deleteAuthorization() {
  var config_id = $(this).attr('data-id');
  var auth_type = $(this).attr('data-type');
  $('#deleteAuthorizationBody').text('Are you sure you want to remove this ' + auth_type + ' connection? Users will not be able to connect to Jami using their ' + auth_type + ' credentials.');
  $('#delete-auth-service-confirm').attr('data-configId', config_id);
  $('#deleteAuthorizationModal').modal('show');
}

// handles authentication service deletion (ldap and ad)
function deleteAuthService(configId) {
  var data = {
    "configId": configId,
  }
  ajaxApiCall(api_path_get_post_configuration_auth_service + "?configId=" + encodeURIComponent(data["configId"]), 'DELETE', null, null, callbackAuthentication);
}

// authentication services callBackFunction
function callbackAuthentication (data, statusCode, jqXHR){
  if (data.status == 200) {
    if (auth_action){
      sessionStorage.setItem("auth_added", "New " + auth_type + " authentication registry connection successfully added.");
    }
    location.reload();
  }
  else {
    if ($('#LDAPModalCenter').is(':visible')) {
      $('.configMessageAuth').remove();
      $('#LDAPModalLongTitle').before('<div class="configMessageAuth" id="configMessageError"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>An error has occured, please try again...</div>');
      $("#LDAPModalCenter").on("hidden.bs.modal", function () {
        $('.configMessageAuth').remove();
      });
    }
    if ($('#ADModalCenter').is(':visible')) {
      $('.configMessageAuth').remove();
      $('#ADModalLongTitle').before('<div class="configMessageAuth" id="configMessageError"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>An error has occured, please try again...</div>');
      $("#ADModalCenter").on("hidden.bs.modal", function () {
        $('.configMessageAuth').remove();
      });
    }
  }
}

// read file content
function readSingleFile(evt, fieldContents) {
    var f = evt.target.files[0];
    if (f) {
        var r = new FileReader();
        r.onload = function (e) {
            var contents = e.target.result;
            $(fieldContents).val(contents);
        }
        r.readAsText(f);
        return f.name;
    }
}

// clean error message when input field selected
$('input, textarea').focus(function() {
    $('.configMessage').hide();
});

// clean error messages when button selected
$('button').click(function() {
    $('.configMessage').hide();
});

// show tooltip
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

