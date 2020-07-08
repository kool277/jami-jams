import configApiCall from "api.js";
import axios from 'axios';

import { api_path_post_install_admin, api_path_post_auth_login } from "globalUrls";

class Auth {
    constructor() {
        this.authenticated = false
        this.admin = false
    }

    login(jsonData, cb) {
        axios(configApiCall(api_path_post_auth_login, "POST", jsonData, null)).then((response) => {
            this.authenticated = true
            cb()
        }).catch(() => {
            //setErrorMessage(true);
            console.log("Error");
        });
    }

    logout(cb) {
        this.authenticated = false
        cb()
    }

    isAuthenticated() {
        return this.authenticated;
    }

    checkAdminAccountStatus(cb) {
        axios(configApiCall(api_path_post_install_admin, "GET", null, null)).then((response) => {
            if (response['headers']['showlogin'] == "true") {
                this.admin = true
                console.log("True")
            }
            cb()
        }).catch((error) => {
            console.log("Error during API request on checkAdminAccountStatus: " + error)
        });
    }

    hasAdmin() {
        return this.admin
    }
}

export default new Auth()