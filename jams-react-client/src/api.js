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

import {
  url_path,
  url_port,
  api_path_get_auth_user_search,
  api_path_get_auth_devices,
  api_path_get_admin_devices,
  api_path_post_configuration_change_password,
  api_path_post_create_user,
  api_path_post_update_user,
  api_path_get_user_directory_search,
  api_path_blueprints,
} from "globalUrls";

let isSearch = false;

export default function configApiCall(
  api_path,
  request_type,
  data,
  credentials
) {
  // build config call
  const config = {
    url: url_path + ":" + url_port + api_path,
    method: request_type,
    crossDomain: true,
    dataType: "json",
  };

  // pass credentials in the header
  if (credentials) {
    config["headers"] = {
      Authorization:
        "Basic " +
        btoa(credentials["username"] + ":" + credentials["password"]),
    };
  }

  if (window.localStorage.getItem("access_token")) {
    const jwt = localStorage.getItem("access_token");
    config["headers"] = {
      Authorization: "Bearer " + jwt,
    };
  }

  // pass data in the header
  if (data) {
    if (
      api_path === api_path_get_user_directory_search ||
      api_path === api_path_get_auth_user_search ||
      (api_path === api_path_post_create_user && request_type === "POST") ||
      (api_path.includes(api_path_blueprints) && request_type === "POST") ||
      api_path === api_path_post_update_user ||
      api_path === api_path_get_auth_devices ||
      api_path === api_path_get_admin_devices ||
      api_path === api_path_post_configuration_change_password
    )
      isSearch = true;

    // search dataType
    if (isSearch) {
      if (request_type === "GET" || request_type === "DELETE") {
        config["params"] = data;
      } else {
        config["data"] = data;
      }
    } else {
      if (window.localStorage.getItem("access_token")) {
        const jwt = localStorage.getItem("access_token");

        config["headers"] = {
          Authorization: "Bearer " + jwt,
        };
      } else {
        config["headers"] = {
          "Content-type": "application/json",
        };
      }

      config["data"] = JSON.stringify(data);
    }
  }

  isSearch = false;
  return config;
}
