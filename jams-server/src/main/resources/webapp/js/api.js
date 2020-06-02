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

var key = 'JSESSIONID';
var keyUsername = 'username';
var keyAdmin = 'isAdmin';
var cookie = '';
var connectedUsername = '';
var admin_account = false;
var isAdmin = false;
var isSearch = false;
var uri_endpoint = '';
var uri = '';
var apiCheck = false;
var current_uri = window.location.href;
var backend_address = new URL(window.location.href);
var url_path = backend_address.protocol + "//" + backend_address.hostname;
var url_port = backend_address.port;
var ca_setup_page = 'ca-setup.html';
var identity_management_page = 'identity-management.html';
var server_parameters_page = 'server-parameters.html';
var api_path_post_install_admin = '/api/install/start';
var api_path_post_auth_login = '/api/auth/login';
var api_path_post_install_ca = '/api/install/ca';
var api_path_post_install_auth = '/api/install/auth';
var api_path_post_install_server = '/api/install/settings';
var api_path_get_install_lastKnownStep = '/api/install/lastStep';
var api_path_get_auth_users = '/api/auth/users';
var api_path_get_auth_user_search = '/api/auth/users';
var api_path_get_auth_devices = '/api/auth/devices';
var api_path_delete_auth_user_revoke = '/api/auth/user';
var api_path_delete_auth_device_revoke = '/api/auth/device';
var api_path_rename_device = '/api/auth/device';
var api_path_get_server_status = '/api/info';
var api_path_post_api_check = '/api/auth/check';
var api_path_get_logout = '/api/auth/logout';
var api_path_get_post_configuration_auth_service = '/api/configuration/authservice';
var api_path_get_post_configuration_global_settings = '/api/configuration/globalsettings';
var api_path_post_configuration_change_password = '/api/configuration/changepassword';
var api_path_post_configuration_register_license = '/api/configuration/registerlicense';
var api_path_get_auth_license = '/api/auth/license';
var api_path_get_auth_services = '/api/auth/authservices';
var api_path_get_needs_update = '/api/checkupdate';
var api_path_get_start_update = '/api/startupdate';
var api_path_post_create_user = '/api/user/create';
var api_path_post_update_user = '/api/user/update';
var api_path_post_exists_user = '/api/user/exists';
var api_path_get_user_extended_data ='/api/auth/user/extendeddata';
var api_path_get_user_needs_reset ='/api/user/needsreset';


function ajaxApiCall(api_path, request_type, data, credentials, callBackFunction, async) {
    // build AJAX call
    var ajax = {
        url: url_path + ":" + url_port + api_path,
        type: request_type,
        crossDomain: true,
        dataType: "json",
        success: function(data, statusCode, jqXHR) {
          callBackFunction(data, statusCode, jqXHR);
        },
        error: function(data, statusCode, jqXHR) {
            callBackFunction(data, statusCode, jqXHR);
        }};

    // pass credentials in the header
    if (credentials) {
        ajax['headers'] =  {
            "Authorization": "Basic " + btoa(credentials["username"] + ':' + credentials["password"]),
        }
    }

    if (window.localStorage.getItem('access_token')) {

        var jwt = localStorage.getItem('access_token');
        console.log(jwt);
        console.log(data);

        ajax['headers'] =  {
            "Bearer": jwt,
        }
    }

    // pass data in the header
    if (data) {
        if (api_path == api_path_get_user_extended_data || api_path == api_path_get_auth_user_search || api_path == api_path_get_user_needs_reset)
            isSearch = true;

        // search dataType
        if (isSearch) {
            ajax['data'] = data;
        }
        else {

            if (window.localStorage.getItem('access_token')) {

                var jwt = localStorage.getItem('access_token');
                console.log(jwt);

                ajax['headers'] =  {
                    "Bearer": jwt,
                }
            }

            ajax['headers'] =  {
                "Content-type":"application/json",
                "Bearer": jwt
            }
            ajax['data'] = JSON.stringify(data);
        }
    }

    // async
    if (!async) {
        ajax['async'] = async;
    }

    $.ajax(ajax);
    isSearch = false;
    return data;
}

function set_installation_response(url, completed){
    return function (data, statusCode, jqXHR) {
        // endpoint does not exists
        if (data) {
            if (data.status == 404) {
                $('#installCompleteModalCenter').modal('show');
            } else if ((data.status == 500 || data.status == 0) && url.includes("usePublicNS"))   {
                $('#installErrorModalLongTitle').text('Connection Failed');
                $('#install-error-id').text('The information provided appears to be incorrect, the connection to the directory has failed.' +
                                              'Please check the information and credentials provided and try again.');
                $('#installErrorModalCenter').modal('show');
            }
            // server error
            else if (data.status == 500 || data.status == 0) {
                $('#installErrorModalCenter').modal('show');
            }
            // 200 OK
            else if (data.status = 200) {
                $('#installErrorModalLongTitle').text('Server Error');
                $('#install-error-id').text('Invalid data.');
                window.location.replace(url);
            }
        }
        else if (jqXHR) {
            if (jqXHR.status = 200) {
                window.location.replace(url);
            }
        }
    }
}
