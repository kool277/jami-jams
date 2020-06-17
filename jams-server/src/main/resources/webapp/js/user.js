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

var deviceId = '';
var searchData = {};
var userData = {};
var b64;
var hsqlconfig = false;
var username = '';

$(document).ready(function() {

    // fill User information
    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null){
            return null;
        } else {
            return decodeURI(results[1]) || 0;
        }
    }

    username = $.urlParam('username');

    // check if we have a username parameter
    if (username != '' && username != null) {

        searchData = {
            "queryString":username
        };

        userData = {
            "username":username
        };

        // set User devices information
        ajaxApiCall(api_path_get_auth_devices, 'GET', userData, null, setUserDevices);

        // revoke user
        $( '.user-information' ).on( 'click', '.de-authorize-user', function () {
            $('#deAuthorizeModal').modal('show');
        });

        //edit user
        $( '.user-information' ).on( 'click', '.edit-user', function () {
            var userDataParams = new URLSearchParams(userData).toString();
            $('#form-user-update')[0].reset();
            // attempt auto-fill
            ajaxApiCall(api_path_get_user_directory_search, 'GET', userDataParams, null, handleUserAutofill);
            document.getElementById('picture-filename-update').addEventListener('change', handleFileSelect, false);
            $('#updateUserModalCenter').modal('show');
            $('#updateUserButton').replaceWith($('#updateUserButton').clone());
            document.getElementById("updateUserButton").addEventListener('click', function(e) {
                e.preventDefault();

                var data = {
                    'givenName': $('#input-givenName-update').val(),
                    'sn': $('#input-sn-update').val(),
                    'CN': encodeURIComponent(userData["username"]),
                    'mail': $('#input-mail-update').val(),
                    'jpegPhoto': b64,
                    'o': $('#input-o-update').val(),
                    'facsimileTelephoneNumber': $('#input-facsimileTelephoneNumber-update').val(),
                    'telephoneNumber': $('#input-telephoneNumber-update').val(),
                    'extension': $('#input-extension-update').val(),
                    'mobile': $('#input-mobile-update').val()
                }
                ajaxApiCall(api_path_put_update_user, 'POST', data, null, handleUserUpdate);
            });

        });

        $('#de-authorize-user').on('click', function() {
            $('#deAuthorizeModal').modal('hide');
            var w = $('.de-authorize-user').width();
            isSearch = false;
            $('.de-authorize-user').width(w);
            $('.de-authorize-user').text("");
            $('.de-authorize-user').append("<span class=\"spinner-border text-light spinner-border-sm\" role=\"status\"></span>");
            ajaxApiCall(api_path_delete_auth_user_revoke + "?username=" + encodeURIComponent(userData["username"]), 'DELETE', null, null, revokeUser);
        });

        $( '.user-information' ).on( 'click', '.reset-password', function (e) {
            ajaxApiCall(api_path_get_user_needs_reset, 'GET', searchData, null, handleNewOTP);
        });

        // change device name
        $( '.devices-results-container' ).on( 'click', '.edit-device-name', function () {
            var deviceId =  $(this).attr("data-device-id");
            var deviceName = $('tr[data-device-id="' + deviceId + '"]').find('.device-name').text()
            $('#editDeviceNameModal').attr('data-device-id', deviceId);
            $('#device-id-modal').text(deviceId);
            $('input[name="deviceId"]').val(deviceId);
            $('input[name="deviceName"]').val(deviceName);
            $('#editDeviceNameModal').modal('show');
        });

        $('#save-device-name').on('click', function() {
            $('#editDeviceNameModal').modal('hide');
            deviceId = $('input[name="deviceId"]').val();
            deviceName = $('input[name="deviceName"]').val();
            $('.loading').show();
            ajaxApiCall(api_path_rename_device + "?deviceId=" + deviceId + "&deviceName=" +  deviceName, 'PUT', null, null, renameDeviceHandler);
        });

        // revoke user device
        $( '.devices-results-container' ).on( 'click', '.de-activate-device', function () {
            var deviceId =  $(this).attr("data-device-id");
            $('#revokeDeviceModal').attr('data-device-id', deviceId);
            $('#device-id-modal').text(deviceId);
            $('#revokeDeviceModal').modal('show');
        });

        $('#revoke-device-confirm').on('click', function() {
            $('#revokeDeviceModal').modal('hide');
            deviceId = $('#revokeDeviceModal').attr("data-device-id");
            isSearch = false;
            $('.loading').show();
            ajaxApiCall(api_path_delete_auth_device_revoke + "?deviceId=" + deviceId, 'DELETE', null, null, revokeDeviceHandler);
        });

        $('.dismiss-device').on('click', function(){
            $('#revokeDeviceModal').attr('data-device-id', '');
            $('#device-id-modal').text('');
        });


        // set User information fields
        setTimeout(function() {
            ajaxApiCall(api_path_get_directories, 'GET', null, null, ishsqlConfig);
            ajaxApiCall(api_path_get_user_directory_search, 'GET', searchData, null, setUserInfoDataSource);
            ajaxApiCall(api_path_get_user_directory_search, 'GET', searchData, null, setUserExtendedData);
        }, 300);

    }
    else {
        $('.user-information-container').remove();
        $('.devices-results-container').append('<tr class="empty-results bubble"><td colspan="5" class="text-alert">Cannot get user\'s devices</td></tr>').fadeIn('slow');
    }
});

function setUserInfoDataSource(data, statusCode, jqXHR) {
    if (jqXHR.status == 200) {
        var status_class = '';
        var resultSet = data;
        var userRow = '';
        var disabled = '';
        if (resultSet.length > 0) {
            // build table row for User item
            for (i = 0; i < resultSet.length; i++) {
                var status = '';
                // determine User status
                if (resultSet[i].revoked) {
                    status = 'Revoked';
                    disabled = true;
                    status_class = 'text-danger';
                }
                else {
                    status = 'Active';
                    status_class = '';
                }

                $('#username-modal').text(resultSet[i].username);

                userRow +=
                    '<div class="row"><div class="col-md-4 col-sm-12"><div id="left_panel" class="user-information__left"><h5 class="user-detail"></h5></div></div><div id="rightcolumn" class="col-md-8 col-sm-12"></div></div>' +
                    '<h5 className="user-detail"><i id="status-whatever" class="'+ status_class +'">' + status +
                    '</i></h5>';

                if (getAdminStatus()) {
                    if(hsqlconfig)
                        userRow += '<div class="user-information__right"><button class="reset-password text-uppercase"><i class="fa fa-edit"></i>Reset Password</button><button class="edit-user text-uppercase"><i class="fa fa-edit"></i>Edit User</button><button class="btn-danger text-uppercase de-authorize-user">Revoke User</button></div>';
                    else
                        userRow += '<div class="user-information__right"><button class="btn-danger text-uppercase de-authorize-user">Revoke User</button></div>';
                }
            }
            $('.user-information').append(userRow);

            if (disabled) {
                $('.de-authorize-user').prop('disabled', true);
            }
        }
        else {
            $('.user-information-container').remove();
        }

    }
    else {
        $('.user-information-container').remove();
    }
}

function setUserExtendedData(data, statusCode, jqXHR) {
    if (jqXHR.status == 200) {
        var resultSet = data;
        var userRow = '';
        var disabled = '';
        if (resultSet.length > 0) {
            // build table row for User item
            for (i = 0; i < 1; i++) {
                var givenName = '';
                var sn = '';
                var mail = '';
                var jpegPhoto = '';
                var o = '';
                var extension = '';
                var facsimileTelephoneNumber = '';
                var telephoneNumber = '';
                var mobile = '';

                if (resultSet[i].firstName)
                    givenName = resultSet[i].firstName;
                else
                    givenName = "Unavailable";

                if (resultSet[i].lastName)
                    sn = resultSet[i].lastName;
                else
                    sn = "Unavailable";

                if (resultSet[i].email)
                    mail = resultSet[i].email;

                if (resultSet[i].profilePicture)
                    jpegPhoto = resultSet[i].profilePicture;

                if (resultSet[i].organization)
                    o = resultSet[i].organization;

                if (resultSet[i].phoneNumberExtension)
                    extension = resultSet[i].phoneNumberExtension;

                if (resultSet[i].faxNumber)
                    facsimileTelephoneNumber = resultSet[i].faxNumber;

                if (resultSet[i].phoneNumber)
                    telephoneNumber = resultSet[i].phoneNumber;

                if (resultSet[i].mobileNumber)
                    mobile = resultSet[i].mobileNumber;


                userRow +=
                    '<pre><h2 class="user-detail"><strong id="input-givenName" class="givenName">' + givenName + '</strong> <strong id="input-sn" class="sn">' + sn +
                    '</strong></h2><h5 id="here" class="user-detail">' + resultSet[i].username + ", " +
                    '</h5><hr class="interline"><h5 class="user-detail"><strong id="input-mail">Email  </strong><span class="mail">' + mail +
                    '</span></h5><h5 class="user-detail"><strong id="input-o">Organisation  </strong><span class="o">' + o +
                    '</span></h5><h5 class="user-detail"><strong id="input-extension">Extension  </strong><span class="extension">' + extension +
                    '</span></h5><h5 class="user-detail"><strong id="input-facsimileTelephoneNumber">FAX Number  </strong></span class="facsimileTelephoneNumber">' + facsimileTelephoneNumber +
                    '</span></h5><h5 class="user-detail"><strong id="input-telephoneNumber">Phone Number  </strong><span class="telephoneNumber">' + telephoneNumber +
                    '</span></h5><h5 class="user-detail"><strong id="input-mobile">Mobile  </strong><span class="mobile">' + mobile +
                    '</span></h5></pre>';


                setTimeout(function() {
                    var span = document.createElement('span');
                    if(jpegPhoto === ""){
                        span.innerHTML = ['<img class="thumb" src="../images/avatar.png" title="', '"/>'].join('');
                    }
                    else if (!jpegPhoto.includes("data:image")) {
                        jpegPhoto = "data:image/png;base64," + jpegPhoto;
                        span.innerHTML = ['<img class="thumb" src="', (jpegPhoto),
                            '" title="', '"/>'].join('');
                    } else {
                        span.innerHTML = ['<img class="thumb" src="', (jpegPhoto),
                            '" title="', '"/>'].join('');
                    }
                    document.getElementById('left_panel').insertBefore(span, null);
                }, 100);

            }
            $('#rightcolumn').append(userRow);
            $('#here')[0].appendChild($('#status-whatever')[0]);

            if (disabled) {
                $('.de-authorize-user').prop('disabled', true);
            }
        }
    }
}

function setUserDevices(data, statusCode, jqXHR) {
    if (jqXHR.status == 200) {
        var resultSet = data;
        var deviceRow = '';
        // build table row for User device items
        if (resultSet.length > 0) {
            for (i = 0; i < resultSet.length; i++) {
                var status = '';
                var disabled = '';
                var date = resultSet[i].activationDate;
                // determine User status
                if (!(resultSet[i].revoked)) {
                    status = 'Active';
                }
                else {
                    status = 'Revoked';
                    disabled = 'disabled';
                }
                deviceRow +=
                    '<tr data-device-id="' + resultSet[i].deviceId + '"><td class="mobile">Device ID</td><td>' + resultSet[i].deviceId +
                    '</td><td class="mobile">Device Name</td><td class="device-name">' + resultSet[i].deviceName +
                    '</td><td class="mobile">Creation Date</td><td>' + date +
                    '</td><td class="mobile">Status</td><td id="device-status" data-device-id="' + resultSet[i].deviceId + '">' + status +
                    '</td><td class="mobile">Actions</td><td><button class="edit-device-name" data-device-id="' + resultSet[i].deviceId + '"><i class="fa fa-edit"></i></button>' +
                    '<button class="btn-danger de-activate-device" data-device-id="' + resultSet[i].deviceId + '"' + disabled + '><i class="fa fa-trash"></i></button>' +
                    '</td><td class="spacer--table">spacer</td></tr>';
            }
            $('.devices-results-container').append(deviceRow);
        }
        else {
            $('.devices-results-container').append('<tr class="empty-results bubble"><td colspan="5" class="text-alert">No device found</td></tr>').fadeIn('slow');
        }
    }
    else {
        $('.devices-results-container').append('<tr class="empty-results bubble"><td colspan="5" class="text-alert">Cannot get user\'s devices</td></tr>').fadeIn('slow');
    }
}

function revokeUser(data, statusCode, jqXHR) {
    if (jqXHR.status == 200) {
        $('#user-status').text("Revoked");
        $('#user-status').addClass("text-danger");
        $('.de-authorize-user').prop('disabled', true);
        $('.devices-results-container').empty();
        // update User devices information
        isSearch = true;
        ajaxApiCall(api_path_get_auth_devices + "?username=" + encodeURIComponent(userData["username"]), 'GET', null, null, setUserDevices);
        setTimeout(function () {
            $('.de-authorize-user').empty();
            $('.de-authorize-user').text("Revoke User");
        }, 1250); // in milliseconds
    }
    else {
        setTimeout(function () {
            $('.de-authorize-user').empty();
            $('.de-authorize-user').text("Revoke User");
        }, 1250);
    }
}

// callback for revoking a device
function revokeDeviceHandler(data, statusCode, jqXHR) {
    var button = $("button[data-device-id='" + deviceId + "']");
    if (jqXHR.status == 200) {
        setTimeout(function () {
            $('.loading').hide();
            $("td[data-device-id='" + deviceId + "']").text("Revoked");
            $(button).prop('disabled', true);
        }, 1000); // in milliseconds
    }
    else {
        setTimeout(function () {
            $('.loading').hide();
            $('.loading').before('<div class="configMessage" id="configMessageError"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>An error has occured, please try again...</div>');
        }, 1000);
    }
}

// callback for renaming a device
function renameDeviceHandler(data, statusCode, jqXHR) {
    var button = $("button[data-device-id='" + deviceId + "']");
    var deviceName = $("input[name='deviceName']").val();
    if (jqXHR.status == 200) {
        setTimeout(function () {
            $('.loading').hide();
            $("tr[data-device-id='" + deviceId + "']").find(".device-name").text(deviceName);
        }, 1000); // in milliseconds
    }
    else {
        setTimeout(function () {
            $('.loading').hide();
            $('.loading').before('<div class="configMessage" id="configMessageError"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>An error has occured, please try again...</div>');
        }, 1000);
    }
}

function handleUserUpdate(){

    $('.user-information').empty();

    setTimeout(function() {
        ajaxApiCall(api_path_get_user_directory_search, 'GET', searchData, null, setUserInfoDataSource);
        ajaxApiCall(api_path_get_user_directory_search, 'GET', searchData, null, setUserExtendedData);
    }, 500);
}

function handleFileSelect(evt) {
    var file = (evt.target.files)[0];

    // Only process image files.
    if (file.type.match('image.*') && !file.name.match('.jpeg$') && !file.name.match('.svg$')) {

        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function() {
            return function(e) {
                var parent = document.getElementById("list");
                while (parent.firstChild) {
                    parent.firstChild.remove();
                }
                b64 = (e.target.result);
                // Render thumbnail.
                var span = document.createElement('span');
                span.innerHTML = ['<img class="thumb" src="', e.target.result,
                    '" title="', escape(file.name), '"/>'].join('');
                document.getElementById('list').insertBefore(span, null);
            };
        })(file);

        // Read in the image file as a data URL.
        reader.readAsDataURL(file);
    }
    else {
        var parent = document.getElementById("list");
        while (parent.firstChild) {
            parent.firstChild.remove();
        }
        var span = document.createElement('span');
        b64 = "";
        span.innerHTML = ['<img class="thumb" src="../images/avatar.png" title=""/>'].join('');
        document.getElementById('list').insertBefore(span, null);
    }
}


function handleUserAutofill(data, statusCode, jqXHR) {
    if (jqXHR.status == 200) {
        var resultSet = data[0];

        if (resultSet.jpegPhoto)
            b64 = resultSet.jpegPhoto;
        $('#input-givenName-update').val(resultSet.firstName);
        $('#input-sn-update').val(resultSet.lastName);
        $('#input-mail-update').val(resultSet.mail);
        $('#input-o-update').val(resultSet.org);
        $('#input-facsimileTelephoneNumber-update').val(resultSet.faxNumber);
        $('#input-telephoneNumber-update').val(resultSet.telephoneNumber);
        $('#input-extension-update').val(resultSet.extension);
        $('#input-mobile-update').val(resultSet.mobilePhoneNumber);
    }
}

function ishsqlConfig(data, statusCode, jqXHR){
    var isAd = false;
    var isLdap = false;
    if (jqXHR.status == 200 && data.length != 0) {
        var resultSet = data;
        for (i = 0; i < resultSet.length; i++) {
            if (resultSet[i] === "net.jami.accountmanagementserver.activedirectoryconnector.ActiveDirectoryConnector")
                isAd = true;
            if (resultSet[i] === "net.jami.accountmanagementserver.ldapconnector.LDAPConnector")
                isLdap = true;
        }
        if(!isAd && !isLdap)
            hsqlconfig = true;
    }
}

function handleNewOTP(data, statusCode, jqXHR) {

    if (jqXHR.status == 200) {

        if (data.needsReset == "false") {
            $('#otpModalCenter').modal('show');
            $('#user-pw-modal-body').text("User password reset. Here is the new one time password: " + data.newPW);
        } else {
            // show modal
            $('#otpModalCenter').modal('show');
            $('#user-pw-modal-body').text("User has not changed his temporary password. Current password: " + data.otp);
        }

    }
}

// clean error messages when button selected
$('button').click(function() {
    $('.configMessage').hide();
});

var elem = document.getElementById('goSearch');
var pageName = 'search.html';
elem.href += pageName;

