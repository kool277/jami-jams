/*
 *     JAMS - Jami Account Management Server
 *     Copyright (C) 2019 Savoir-faire Linux Inc.
 *
 *     Author: William Enright <william.enright@savoirfairelinux.com>
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

document.getElementById("changePasswordButton").addEventListener('click', function() {

    event.preventDefault();
    console.log("in click event");
    var inputPassword = $('#inputNewPassword').val();
    var inputConfirmPassword = $('#inputConfirmPassword').val();
    var oldPassword = $('#inputCurrentPassword').val();
    var username = window.location.href.substring(window.location.href.indexOf("=") + 1, window.location.href.length);
    console.log(username);


    // In theory we already have the username and we shouldn't be able to change it.
    jsonData = {
        "username": username,
        "password": inputPassword,
        "oldPassword": oldPassword
    }
    credentials = {
        "username": username,
        "password": inputPassword,
        "oldPassword": oldPassword
    }

    console.log(jsonData);
    console.log(credentials);

    // If password and confirmPassword not entered
    if (inputPassword == '' || inputConfirmPassword == '') {
    }
    else if (inputPassword != inputConfirmPassword) {
        $('#message').html('Password did not match: Please try again ..').css('color', '#bd2130');
        event.preventDefault();
    }
    else if (inputPassword == inputConfirmPassword) {
        $('#message').html('Password Match: Welcome to Jams').css('color', '#28a745');
        if (credentials["username"] && credentials["password"] && credentials["oldPassword"]) {
            console.log("updating local account...");
            ajaxApiCall(api_path_post_update_user, "POST", jsonData, null, updateLocalAccountPasswordCallBackHandler);
        }
    }
});


function updateLocalAccountPasswordCallBackHandler() {
    console.log("account update successful!");
    // now we can login normally
    ajaxApiCall(api_path_post_auth_login, "POST", jsonData, null, signinCallBackHandler);
}