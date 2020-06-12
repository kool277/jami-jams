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

var type_int_name_input = ['deviceLifetime', 'userLifetime'];
var callback = set_installation_response("search.html", true);

$(document).ready(function () {

    if (window.location.href.indexOf("usePublicNS") > -1 && window.location.href.indexOf("true") > -1) {
        $('#domain')[0].value = ("http://ns.jami.net");
        $('#domain')[0].disabled = true;
    }

    $('#sipFile').change(function (event) {
        var name = readSingleFile(event, '#sipContents');
        $('.custom-file-label').text(name)
    });
});

// submit server parameters
$("#form-server-parameters").submit(function (event) {
    event.preventDefault();
    var form = $(this);
    // validate CORS domain name with regex
    var re = new RegExp(/^http[s]?:\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*$/);

    // set server-parameters
    if ((document.getElementsByClassName('form-control')[0].value).match(re))
        setParametersData(form);
    else
        $('#badUrlModalCenter').modal('show');

});

$('#deviceLifetime').on('change', function() {
    // disable userlife time if it's less than the device lifetime
    var device_value = $(this).val();
    $('#userLifetime > option').each(function(){
        if(parseInt(device_value) <= parseInt(this.value)){
            $(this).prop('disabled', false);
        }
        else{
            $(this).prop('disabled', true);
        }
    })
});

function setParametersData(form) {
    var data = {};
    $.each($(form).serializeArray(), function (i, field) {
        data[field.name] = parseInt(field.value);
    });

    if ($('#sipContents').val() != "")
        data['sipConfig'] = $('#sipContents').val();

    data['serverDomain'] = $('#domain').val();
    data['signingAlgorithm'] = "SHA512WITHRSA";

    // send parameters via POST request
    postParameters(data)
}

// send AJAX request
function postParameters(data) {
    ajaxApiCall(api_path_post_install_server,'POST',data,null,callback);
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

// show tooltip
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})
