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

 function signupPageHandler(data) {

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
     else if (data.getResponseHeader('showLogin') == "true" || data.status == 404) {
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

function noAuthorization() {
  window.location.replace("signup.html");
}

function getAdminStatus() {

    var tokenJSON = JSON.parse(atob(window.localStorage.getItem('access_token').split('.')[1]));
    if (tokenJSON.scope == "ADMIN")
        return true;
    else
        return false;
}

function getUser() {
    var tokenJSON = JSON.parse(atob(window.localStorage.getItem('access_token').split('.')[1]));
    if (tokenJSON.scope == "USER")
        return tokenJSON.sub;
    else
        return "";
}

function getServerConfigStatus() {
  ajaxApiCall(api_path_get_server_status, 'GET', null, null, serverConfigStatus, false);
}

function serverConfigStatus(data) {
    // check if server is installed
    if (data.installed == "true") {
        if (getAdminStatus() && (!current_uri.includes('search.html')) && (!current_uri.includes('user.html')) && (!current_uri.includes('config.html'))) {
            window.location.replace("search.html");
        }
        else if (!getAdminStatus() && getUser() && (!current_uri.includes('user.html'))) {
            window.location.replace("user.html?username=" + getUser());
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

function lastServerConfigurationStepUri(data, statusCode, jqXHR) {
}

function invalidLogin() {
  $('#invalidModalCenter').modal('show');
}
