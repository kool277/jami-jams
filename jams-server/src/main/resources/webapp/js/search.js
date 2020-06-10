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

var isActive = false;
var interval;
var b64;
var userEdit = '';
var userRevoke = '';

$(document).ready(function() {

    var data = {
        'queryString': "*"
    }

    // load all users
    ajaxApiCall(api_path_get_user_directory_search, 'GET', data, null, listAllUsers);

    setTimeout(function() {
        ajaxApiCall(api_path_get_needs_update, 'GET', null, null, handleUpdate, false);
    }, 1000);

    interval = setInterval(function(){
        ajaxApiCall(api_path_get_needs_update, 'GET', null, null, handleUpdate, false);
    }, 360000000);

    document.getElementsByClassName("user-create-div")[0].addEventListener('click', function() {

        // reset form and listeners
        $('#form-user-create')[0].reset();
        $('#input-cn').replaceWith($('#input-cn').clone());
        $('#createUserButton').replaceWith($('#createUserButton').clone());
        $('#picture-filename').replaceWith($('#picture-filename').clone());
        $('#valid-cn').text("");


        // search for username on every form
        $('#input-cn').keyup(function() {
            var input =  $('#input-cn').val();
            // search for non empty input
            if (input != '') {
                var data = {
                    "username": input
                }
                ajaxApiCall(api_path_post_exists_user, 'POST', data, null, handleUserExists);
            }
        });

        document.getElementById('picture-filename').addEventListener('change', handleFileSelect, false);
        $('#createUserModalCenter').modal('show');
        document.getElementById("createUserButton").addEventListener('click', function(e) {
            e.preventDefault();

            var data = {
                'givenName': $('#input-givenName').val(),
                'sn': $('#input-sn').val(),
                'CN': $('#input-cn').val(),
                'mail': $('#input-mail').val(),
                'jpegPhoto': b64,
                'o': $('#input-o').val(),
                'facsimileTelephoneNumber': $('#input-facsimileTelephoneNumber').val(),
                'telephoneNumber': $('#input-telephoneNumber').val(),
                'extension': $('#input-extension').val(),
                'mobile': $('#input-mobile').val()
            }

            // send post request
            if ($('#input-cn').val() != "" && $('#valid-cn').val() == "")
                submitForm(data);
        });
    });

});

// search for Users on every keyup
$('#search').keyup(function(e) {
    var input =  e.currentTarget.value;
    var inputLength = e.currentTarget.value.length;
    // search for non empty input
    if (input != '') {
        // searchFunction(input);
        var data = {
            "username":input
        }
        isSearch = true;
        ajaxApiCall(api_path_get_user_extended_data, 'GET', data, null, searchFunction);
    }
    else
        ajaxApiCall(api_path_get_user_extended_data, 'GET', null, null, listAllUsers);

    // reset previous resultset
    $('.user-data').remove();
    $('.empty-results').remove();

    $('*[data-href]').on('click', function() {
        window.location = $(this).data("href");
    });
});

function listAllUsers(data, statusCode, jqXHR)
{
  if (jqXHR.status == 200 && data.length != 0) {
    var resultSet = data;
    var userRow = '';
    // build table row for each User item
    for (i = 0; i < resultSet.length; i++) {
      var firstName = '';
      var lastName = '';
      console.log(resultSet[i]);

      if (resultSet[i].firstName)
          firstName = resultSet[i].firstName;
      else
          firstName = "Unavailable";

      if (resultSet[i].lastName)
          lastName = resultSet[i].lastName;
      else
          lastName = "Unavailable";

      userRow +=
        '<tr class="user-data bubble"><td data-href="aa" class="mobile">Username</td><td style="cursor:pointer;" data-href="user.html?username=' + encodeURIComponent(resultSet[i].username) + '">' + resultSet[i].username +
        '</td><td class="mobile">First Name</td><td style="cursor:pointer;" data-href="user.html?username=' + encodeURIComponent(resultSet[i].username) + '">' + firstName + '' +
        '</td><td class="mobile">Last Name</td><td style="cursor:pointer;" data-href="user.html?username=' + encodeURIComponent(resultSet[i].username) + '">' + lastName +
        '</td><td class="mobile">Devices</td><td style="cursor:pointer;" data-href="user.html?username=' + encodeURIComponent(resultSet[i].username) +'"><i class="fa fa-mobile"></i></td><td class="spacer--table">spacer</td>' +
        '<td class="mobile">Actions</td><td class="user-information-search"><button class="edit-user" title="Edit User" style="display: none;" user-id="' + encodeURIComponent(resultSet[i].username) + '"><i class="fa fa-edit"></i></button>' +
        '<button type="button" id="de-authorize-user" class="btn-danger de-authorize-user" title="Revoke User" user-id="' + encodeURIComponent(resultSet[i].username) + '"' + '><i class="fa fa-trash"></i></button>' +
        '</td><td class="spacer--table">spacer</td></tr>'
    }

    $('.empty-results').remove();
    $('tbody').empty();
    $('tbody').append(userRow).fadeIn('slow');
  }
  else {
    $('tbody').append('<tr class="empty-results bubble"><td colspan="5" class="text-alert">No users found</td></tr>').fadeIn('slow');
  }

  $('*[data-href]').on('click', function() {
    window.location = $(this).data("href");
  });

    setTimeout(function() {
        ajaxApiCall(api_path_get_directories, 'GET', null, null, isLocalDB);
    }, 100);
    addListenersForActions();
}

function addListenersForActions() {
    // revoke user
    $( '.de-authorize-user' ).on( 'click', function (e) {
        console.log("revoke user");
        userRevoke = (e.currentTarget.getAttribute('user-id'));
        $('#deAuthorizeModalCenter').modal('show');
        $('#de-authorize-user-button').on('click', function() {
            console.log("click event");
            $('#deAuthorizeModalCenter').modal('hide');
            var w = $('.de-authorize-user').width();
            isSearch = false;
            $('.de-authorize-user').width(w);
            $('.de-authorize-user').text("");
            $('.de-authorize-user').append("<span class=\"spinner-border text-light spinner-border-sm\" role=\"status\"></span>");
            ajaxApiCall(api_path_delete_auth_user_revoke + "?username=" + userRevoke, 'DELETE', null, null, revokeUser);

        });
    });


    $( '.user-information-search' ).on( 'click', '.edit-user', function (e) {
        userEdit = (e.currentTarget.getAttribute('user-id'));

        var data = {
            "username":userEdit
        }
        var URLSearchData = new URLSearchParams(data).toString();

        // attempt auto-fill
        ajaxApiCall(api_path_get_user_extended_data, 'GET', URLSearchData, null, handleUserAutofill);



        $('#updateUserModalCenter').modal('show');
        document.getElementById('picture-filename-update').addEventListener('change', handleFileSelectUpdate, false);

        $('#updateUserButton').replaceWith($('#updateUserButton').clone());
        document.getElementById("updateUserButton").addEventListener('click', function(e) {
            e.preventDefault();

            var data = {
                'givenName': $('#input-givenName-update').val(),
                'sn': $('#input-sn-update').val(),
                'CN': userEdit,
                'mail': $('#input-mail-update').val(),
                'jpegPhoto': b64,
                'o': $('#input-o-update').val(),
                'facsimileTelephoneNumber': $('#input-facsimileTelephoneNumber-update').val(),
                'telephoneNumber': $('#input-telephoneNumber-update').val(),
                'extension': $('#input-extension-update').val(),
                'mobile': $('#input-mobile-update').val()
            }

            // send post request
            ajaxApiCall(api_path_post_update_user, 'POST', data, null, handleUserUpdate);
        });

    });
}

function handleFileSelectUpdate(evt) {
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
    else{
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

function isActivated(data) {
    var resultSet = data;
    $('#license-type-display').text("Current version JAMS Alpha " + resultSet.currentVersion);
    isActive = resultSet.isActive;
}

function searchFunction(data, statusCode, jqXHR) {
  if (jqXHR.status == 200 && data.length != 0) {
    // parse JSON response
    var resultSet = data;
    var userRow = '';
    // build table row for each User item
    for (i = 0; i < resultSet.length; i++) {
      var status = '';
      // determine User status
        var firstName = '';
        var lastName = '';
        if (resultSet[i].firstName)
            firstName = resultSet[i].firstName;
        else
            firstName = "Unavailable";

        if (resultSet[i].lastName)
            lastName = resultSet[i].lastName;
        else
            lastName = "Unavailable";

        userRow +=
            '<tr class="user-data bubble"><td data-href="aa" class="mobile">Username</td><td style="cursor:pointer;" data-href="user.html?username=' + encodeURIComponent(resultSet[i].username) + '">' + resultSet[i].username +
            '</td><td class="mobile">First Name</td><td style="cursor:pointer;" data-href="user.html?username=' + encodeURIComponent(resultSet[i].username) + '">' + firstName + '' +
            '</td><td class="mobile">Last Name</td><td style="cursor:pointer;" data-href="user.html?username=' + encodeURIComponent(resultSet[i].username) + '">' + lastName +
            '</td><td class="mobile">Devices</td><td style="cursor:pointer;" data-href="user.html?username=' + encodeURIComponent(resultSet[i].username) + '"><i class="fa fa-mobile"></i></td><td class="spacer--table">spacer</td>' +
            '<td class="mobile">Actions</td><td class="user-information-search"><button class="edit-user" user-id="' + encodeURIComponent(resultSet[i].username) + '"><i class="fa fa-edit"></i></button>' +
            '<button type="button" id="de-authorize-user" class="btn-danger de-authorize-user" user-id="' + encodeURIComponent(resultSet[i].username) + '"' + '><i class="fa fa-trash"></i></button>' +
            '</td><td class="spacer--table">spacer</td></tr>'
    }

    $('.empty-results').remove();
    $('tbody').empty();
    $('tbody').append(userRow).fadeIn('slow');
  }
  else {
    // reset table
    $('.user-data').remove();
    if($('.empty-results').length == 0)
    $('tbody').append('<tr class="empty-results bubble"><td colspan="5" class="text-alert">No users found</td></tr>').fadeIn('slow');
  }

  addListenersForActions();
}

function handleUpdate(data, statusCode, jqXHR) {

    ajaxApiCall(api_path_get_auth_license, 'GET', null, null, isActivated, false);

    if (jqXHR.status == 200 && data.length != 0) {
        // parse JSON response
        var resultSet = data;
        if (resultSet.updateAvailable == true) {
            $('#update-title-div').show();
            $('#update-title').text("UPGRADE TO JAMS " + resultSet.remoteVersions.substring(resultSet.remoteVersions.indexOf("=") + 1, resultSet.remoteVersions.length - 1));

            document.getElementsByClassName("update-title")[0].addEventListener('click', function(){
                if (isActive == true) {
                    $('#downloadUpdateModalCenter').modal('show');
                    document.getElementsByClassName("auto-update")[0].addEventListener('click', function() {
                        ajaxApiCall(api_path_get_start_update, 'POST', null, null, handleUpdateStart, false);
                    });
                }
                else
                    $('#noSubscriptionModalCenter').modal('show');
            });
        }
    }
}

function handleUpdateStart() {
    $('#restartModalCenter').modal('show');
    clearInterval(interval);
}

// send post request
function submitForm(data) {
    ajaxApiCall(api_path_post_create_user, 'POST', data, null, handleUserCreation);
}

function handleUserCreation(data, statusCode, jqXHR) {
    $('#user-pw-modal-body').text("");
    $('#userPasswordModalCenter').modal('show');

    if (data.status == 567)
        $('#user-pw-modal-body').text("Username is already in use on the public nameserver. Please choose another one.");
    else if (data.pw == null)
        $('#user-pw-modal-body').text("Failed to create new user. Please try again.");
    else
        $('#user-pw-modal-body').text("New user successfully created. Here is the one time password: " + data.pw);

    ajaxApiCall(api_path_get_user_extended_data, 'GET', null, null, listAllUsers);
}

function handleUserUpdate() {
    ajaxApiCall(api_path_get_user_extended_data, 'GET', null, null, listAllUsers);
}

function handleUserExists(data) {
    $('#valid-cn').text("");

    if (data != null && data.exists == "true"){
        $('#valid-cn').text("Username is already taken!");
        $('#valid-cn').css('color', '#bd2130');
    }
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
    else{
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

function revokeUser(data, statusCode, jqXHR) {
    if (jqXHR.status == 200) {
        $('#user-status').text("Revoked");
        $('#user-status').addClass("text-danger");
        $('.de-authorize-user').prop('disabled', true);
        $('.devices-results-container').empty();
        // update User devices information
        isSearch = true;
    }

    ajaxApiCall(api_path_get_user_extended_data, 'GET', null, null, listAllUsers);
    userRevoke = '';
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

function isLocalDB(data, statusCode, jqXHR){
    if (jqXHR.status == 200) {
        if (data[0].type === "LOCAL" && data[0].realm === "LOCAL") {
            $('.user-create-div').show();
            $('.edit-user').show();
        }
    }
}