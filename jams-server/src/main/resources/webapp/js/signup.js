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

var jsonData = {};
var credentials = {};
var credentials = null;
var date = new Date();
var minutes = 15;

checkAdminAccountStatus();

$(".form-submit").click(function (event) {
  event.preventDefault();
  var inputPassword = $('#inputPassword').val();
  var inputConfirmPassword = $('#inputConfirmPassword').val();
  var username = $('#inputUsername').val();
  var password = $('#inputPassword').val();

  // validate form
  if ($('#form-signup').valid()) {
    jsonData = {
      "username": username,
      "password": password
    }
    credentials = {
      "username": username,
      "password": password
    }
    // If password and confirmPassword not entered
    if (inputPassword == '' || inputConfirmPassword == '') {
    }
    else if (inputPassword != inputConfirmPassword && admin_account == false) {
      $('#message').html('Password did not match: Please try again ..').css('color', '#bd2130');
      event.preventDefault();
    }
    else if (admin_account || inputPassword == inputConfirmPassword) {
      $('#message').html('Password Match: Welcome to Jams').css('color', '#28a745');
      if (credentials["username"] && credentials["password"]) {
        if (admin_account) {
          ajaxApiCall(api_path_post_auth_login, "POST", jsonData, null, signinCallBackHandler);
        }
        else {
          ajaxApiCall(api_path_post_install_admin, "PUT", jsonData, null, createAdminCallBackHandler);
        }
      }
    }
  }
  else {
    event.preventDefault();
  }
  $('#form-signup').validate({
    rules: {
      password: {
        nowhitespace: true
      },
      username: {
        nowhitespace: true
      }
    }
  });
});

// clear credentials
$('#cancel-submit').click(function (event) {
  credentials = null;
});

function createAdminCallBackHandler(data, statusCode, jqXHR) {
  if (jqXHR.status == 200 && data.access_token != 'null') {
    // set username token
    setJWT(data);
    window.location.replace("ca-setup.html");
  }
}

function signinCallBackHandler(data, statusCode, jqXHR) {

    if (jqXHR.status == 200 && data.access_token != 'null' && (data.needsReset == false || data.needsReset == null)) {
    setJWT(data);
    var tokenJSON = JSON.parse(atob(window.localStorage.getItem('access_token').split('.')[1]));
    // check server configuration status
    getServerConfigStatus();
  }  else if (jqXHR.status == 200 && tokenJSON.oneTimePassword == true) {
      getServerConfigStatus();
      window.location.replace("new-password.html?username=" + credentials["username"]);
  }
  else {
    invalidLogin();
  }
}
