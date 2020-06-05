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

$(document).ready(function () {
    $("#formType").change(function () {
        $("#" + $(this).val()).show().siblings().hide();
    });

    $('#caFile').change(function (event) {
        readSingleFile(event, '#caContents');
    });

    $('#keyFile').change(function (event) {
        readSingleFile(event, '#keyContents');
    });

    // import CA
    $('#form-ca-manual').submit(function (event) {
        event.preventDefault();
        var data = {
            'caCertificate': $('#caContents').val(),
            'caKey': $('#keyContents').val()
        }
        // send post request
        submitForm(data);
    });

    // generate CA
    $('#form-ca-auto').submit(function (event) {
        event.preventDefault();
        var data = {
            'fields': {
                'commonName': $('#inputCaName').val(),
                'organizationalUnit': $('#inputOrgUnit').val(),
                'organization': $('#inputOrganization').val(),
                'city': $('#inputCity').val(),
                'state': $('#inputState').val(),
                'country': $('#inputCountry').val(),
                'lifetime': parseInt($('#inputValidity').val())
            }
        }
        // send post request
        submitForm(data);
    });

    $('#fakeCountry').remove();
    document.getElementById("countryPicker").appendChild(document.getElementsByClassName("country-select")[0]);
    ($('.country-select')).css('width', '100%');
    ($('#inputCountry')).css('width', '100%');
});

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
    }
}

// send post request
function submitForm(data) {
    ajaxApiCall(api_path_post_install_ca,'POST',data,null,handleInstallCA);
}

function handleInstallCA(data) {

    if(data.status == 500) {
        $('#caInstallErrorModalCenter').modal('show');
    } else if(data.status == 512) {
        $('#caInstallErrorModalCenter').modal('show');
        $('.ca-modal-body').text("An error occurred when parsing the provided keys or the certificate itself.");
    } else if (data.status == 513) {
        $('#caInstallErrorModalCenter').modal('show');
        $('.ca-modal-body').text("The injected CA is not a valid CA. Please try again.");
    } else if (data.status == 200)
        window.location.replace("identity-management.html");


}
