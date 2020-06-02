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

 // check if admin account is created
 function checkAdminAccountStatus() {
    // ajaxApiCall(api_path_get_server_status, 'GET', null, null, signupPageHandler, false);
    ajaxApiCall(api_path_post_install_admin, "GET", null, null, signupPageHandler);
 }

 function signupPageHandler(data, statusCode, jqXHR) {
     // create Admin

     if(data.getResponseHeader('showLogin') == "false") {
         var inputConfirmPassword = '<div class="form-label-group"><label for="confirmPassword" class="label-title">Confirm Password</label><input type="password" name="confirmPassword"          id="inputConfirmPassword" class="form-control" required autocomplete="off"><span id="message"></span></div>';
         admin_account = false;
         $('.title').text("Administrator account creation");
         $('.subtitle').text("Create the account that will have administrative control over JAMS.");
         $('#form-signup').find('.form-submit').before(inputConfirmPassword);
         $('.form-submit').val("Continue");
         $('#form-signup').removeClass('d-none');
         $('#admin-password-progress-bar-container').show();
     }
     else if (data.getResponseHeader('showLogin') == "true") {
         admin_account = true;
         $('.title').text("Access your account");
         $('.form-submit').val("Log in");
         $('#form-signup').removeClass('d-none');
     }
     // API connection error
     else {
         $('.notification').show();
         $('.form-submit').val("Log in");
         $('.form-submit').prop("disabled", true);
         $('#form-signup').removeClass('d-none');
     }
 }

function checkAuthentication() {
    getServerConfigStatus();
}

function setLogout(data) {
  if (data.status == 200) {
      window.localStorage.removeItem('access_token');
  }
}

function authorizedAdmin() {
  window.location.replace("search.html");
}

function authorizedUser(username) {
  window.location.replace("user.html?username=" + username);
}

function noAuthorization() {
  window.location.replace("signup.html");
}

function getAdminStatus() {
    var adminStatus = getCookie(keyAdmin);
    // if (adminStatus) {
    //   return true;
    // }
    // else {
    //   return false;
    // }
    return true;
}

function getUser() {
  return getCookie(keyUsername);
}

function getApiCheck() {
    apiCheck = true;
}

function setApiStatus(data, statusCode, jqXHR) {
  if (data.status == 200) {
      apiCheck = true;
  }
}

function getServerConfigStatus() {
  ajaxApiCall(api_path_get_server_status, 'GET', null, null, serverConfigStatus, false);
}

function serverConfigStatus(data, statusCode, jqXHR) {
  // hasConnectionToAPI
  getApiCheck();

  if (apiCheck) {
    // server is installed
    if (data.installed == "true") {
      if (getAdminStatus() && (!current_uri.includes('search.html')) && (!current_uri.includes('user.html')) && (!current_uri.includes('config.html'))) {
        authorizedAdmin();
      }
      else if (!getAdminStatus() && getUser() && (!current_uri.includes('user.html'))) {
        authorizedUser(getUser());
      }
      else if (!getAdminStatus() && !getUser() && (!current_uri.includes('signup.html'))) {
        noAuthorization();
      }
    }
    // has an Admin account but server is not installed
    else if (getAdminStatus()) {
      ajaxApiCall(api_path_get_install_lastKnownStep, 'GET', null, null, lastServerConfigurationStepUri, false);
    }
    else if (!current_uri.includes('signup.html')) {
      noAuthorization();
    }
  }
  else if (!current_uri.includes('signup.html') && !current_uri.includes('new-password.html')) {
    noAuthorization();
  }
}

function lastServerConfigurationStepUri(data, statusCode, jqXHR) {
  // if (jqXHR.status == 200) {
  //   // lastKnownStep
  //   var current_page = false;
  //   uri_endpoint = data.uri;
  //   if (uri_endpoint == api_path_post_install_ca) {
  //       uri = ca_setup_page;
  //   }
  //   else if (uri_endpoint == api_path_post_install_auth) {
  //       uri = identity_management_page;
  //   }
  //   else if (uri_endpoint == api_path_post_install_server) {
  //       uri = server_parameters_page;
  //   }
  //   // redirect to lastKnownStep
  //   if (!(current_uri.includes(uri))) {
  //     window.location.replace(uri);
  //   }
  // }
  // else {
  //   invalidLogin();
  // }
}

function invalidLogin() {
  $('#invalidModalCenter').modal('show');
}
