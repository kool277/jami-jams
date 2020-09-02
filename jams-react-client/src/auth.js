import configApiCall from "api.js";
import axios from 'axios';

import { 
    api_path_post_install_admin, 
    api_path_post_auth_login,
    api_path_get_server_status,
    api_path_get_install_lastKnownStep,
    api_path_get_directories,
    api_path_get_subscription_status,
    api_path_get_needs_update,
    api_path_get_start_update
} from "globalUrls";

class Auth {
    constructor() {
        this.authenticated = false
        this.admin = false
        this.installed = false
        this.uri = ''
        this.username = ''
        this.localVersion = ''
        this.remoteVersion = ''
        this.activated = false
        this.updateAvailable = false
    }

    setJWT(access_token) {
        window.localStorage.removeItem('access_token');
        window.localStorage.setItem('access_token', access_token);
    }

    setScope(scope) {
        window.localStorage.removeItem('scope');
        window.localStorage.setItem('scope', scope);
    }

    setLocalDirectory(localDirectory) {
        window.localStorage.removeItem('localDirectory');
        window.localStorage.setItem('localDirectory', localDirectory);
    }

    deleteJWT(){
        window.localStorage.removeItem('access_token');
    }

    setUsername(username) {
        window.localStorage.removeItem('username');
        window.localStorage.setItem('username', username);        
    }

    deleteUserhame() {
        window.localStorage.removeItem('username');
    }

    login(jsonData, cb) {
        this.deleteJWT()
        axios(configApiCall(api_path_post_auth_login, "POST", jsonData, null)).then((response) => {
            if(response.status == 200){
                this.setJWT(response.data['access_token']);
                this.setScope(response.data["scope"] == "ADMIN" ? true : false);
                this.setUsername(jsonData.username);
                this.authenticated = true;
            }
            cb()
        }).catch((error) => {
            cb(error)
        });
    }

    logout(cb) {
        this.deleteJWT()
        this.authenticated = false
        this.deleteUserhame()
        cb()
    }

    isAuthenticated() {
        return this.authenticated;
    }

    isLocalDirectory() {
        return window.localStorage.getItem('localDirectory') === 'true' ? true : false;
    }

    checkDirectoryType(cb){
        axios(configApiCall(api_path_get_directories, "GET", null, null)).then((response) => {
            if (response.data.length == 1) {
                this.setLocalDirectory(true);
            }
            else if (response.data.length == 2){
                this.setLocalDirectory(false);
            }else{
                console.log("Error getting on checkDirectoryType: Size of directory types is " + response.data.length);
            }
            cb()
        }).catch((error) => {
            console.log("Error getting on checkDirectoryType: " + error);
            cb()
        });
    }

    checkAdminAccountStatus(cb) {
        axios(configApiCall(api_path_post_install_admin, "GET", null, null)).then((response) => {
            if (response['headers']['showlogin'] == "true") {
                this.admin = true;
            }
            cb()
        }).catch((error) => {
            if(error.response.status == 404){
                this.admin = true;
            }
            else{
                console.log("Error during API request on checkAdminAccountStatus: " + error);
            }
            cb()
        });
    }

    isServerInstalled(cb) {
        axios(configApiCall(api_path_get_server_status, "GET", null, null)).then((response) => {                       
            if (response.data['installed'] == 'true') {
                this.installed = true
                console.log("Server is installed")
            } else {
                this.installed = false
                console.log("Server is not installed")
            }
            cb()
        }).catch((error) => {
            console.log("Error during API request on checkServerIsInstalled: " + error);
        });
    }

    checkLastKnownStep(cb) {
        if(this.installed){
            this.authenticated = true
            console.log("Auth: Server is already installed")
            cb()
        }else{
            axios(configApiCall(api_path_get_install_lastKnownStep, 'GET', null, null)).then((response) => {
                this.uri = response.data['uri'];
                this.authenticated = true;
                cb()
            }).catch((error) => {
                if(error.response.status == 401){
                    this.authenticated = false;
                    console.log("Error during API request on checkLastKnowStep not authenticated!");
                }
                else{
                    console.log("Error during API request on checkLastKnowStep: " + error);
                }
                cb()
            })
        }
    }

    checkForUpdates(cb) {
        if (this.installed && this.authenticated) {
            axios(configApiCall(api_path_get_subscription_status, 'GET', null, null)).then((response) => {
                this.localVersion = response.data['versions']['jams-server.jar']['version'];
                this.activated = response.data['activated'];
                cb()
            })
        } else {
            axios(configApiCall(api_path_get_install_lastKnownStep, 'GET', null, null)).then((response) => {
                this.uri = response.data['uri']
                this.authenticated = true
                cb()
            }).catch((error) => {
                console.log("Error during API request on checkLastKnownStep: " + error);
                cb()
            })
        }
    }

    getUpdates(cb) {
        if (this.installed && this.authenticated) {
            axios(configApiCall(api_path_get_needs_update, 'GET', null, null)).then((response) => {
                this.remoteVersion = response.data['remoteVersions']['jams-server.jar']['version'];
                this.updateAvailable = response.data['updateAvailable'];
                cb()
            })
        } else {
            axios(configApiCall(api_path_get_install_lastKnownStep, 'GET', null, null)).then((response) => {
                this.uri = response.data['uri']
                this.authenticated = true
                cb()
            }).catch((error) => {
                console.log("Error during API request on checkLastKnownStep: " + error);
                cb()
            })
        }
    }

    isActivated() {
        return this.activated;
    }

    isUpdateAvailable() {
        return this.updateAvailable;
    }

    getLocalVersion() {
        return this.localVersion;
    }

    getRemoteVersion() {
        return this.remoteVersion;
    }

    hasAdmin() {
        return this.admin;
    }

    hasAdminScope(){
        return window.localStorage.getItem('scope') === 'true' ? true : false;
    }

    getUsername(){
        return window.localStorage.getItem('username');
    }

    isInstalled() {
        return this.installed;
    }
}

export default new Auth()