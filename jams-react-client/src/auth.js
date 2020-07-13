import configApiCall from "api.js";
import axios from 'axios';

import { 
    api_path_post_install_admin, 
    api_path_post_auth_login,
    api_path_get_server_status,
    api_path_get_install_lastKnownStep,
} from "globalUrls";

class Auth {
    constructor() {
        this.authenticated = false
        this.admin = false
        this.installed = false
        this.uri = ''
    }

    setJWT(access_token) {
        window.localStorage.removeItem('access_token');
        window.localStorage.setItem('access_token', access_token);
    }

    deleteJWT(){
        window.localStorage.removeItem('access_token');
    }

    login(jsonData, cb) {
        this.deleteJWT()
        axios(configApiCall(api_path_post_auth_login, "POST", jsonData, null)).then((response) => {
            if(response.status == 200){
                this.setJWT(response.data['access_token'])
                this.authenticated = true
            }
            cb()
        }).catch((error) => {
            //setErrorMessage(true);
            console.log("Error: " + error);
            cb()
        });
    }

    logout(cb) {
        this.deleteJWT()
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
            }
            cb()
        }).catch((error) => {
            console.log("Error during API request on checkAdminAccountStatus: " + error)
        });
    }

    isServerInstalled(cb) {
        axios(configApiCall(api_path_get_server_status, "GET", null, null)).then((response) => {                       
            if (response.data['installed'] == 'true') {
                this.installed = true
                console.log("Server is insalled")
            } else {
                this.installed = false
                console.log("Server is not insalled")
            }
            cb()
        }).catch((error) => {
            console.log("Error during API request on checkServerIsInstalled: " + error);
        });
    }

    checkLastKnowStep(cb) {
        axios(configApiCall(api_path_get_install_lastKnownStep, 'GET', null, null)).then((response) => {
            this.uri = response.data['uri']
            this.authenticated = true
            cb()
        }).catch((error) => {
            console.log("Error during API request on checkLastKnowStep: " + error);
            this.authenticated = false
            cb()
        })
    }

    hasAdmin() {
        return this.admin
    }

    isInstalled() {
        return this.installed
    }
}

export default new Auth()