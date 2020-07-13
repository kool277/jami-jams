import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import Select from '@material-ui/core/Select';

import buildSelectMenuItems from '../../tools'

import axios from 'axios';
import configApiCall from '../../api'
import { api_path_post_install_auth } from '../../globalUrls'

import LocalStorageForm from './LocalStorageForm'
import LdapForm from './LdapStorageForm'
import AdStorageForm from './AdStorageForm'

import auth from '../../auth'


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function IdentityManagement(props) {

    const directoryTypes = [
        {value: 0, label: "Local Database"},
        {value: 1, label: "LDAP Server"},
        {value: 2, label: "Active Directory"},
    ];
    
    const directoryTypesItems = buildSelectMenuItems(directoryTypes);

    const classes = useStyles();
    const history = useHistory();
    const [error, setError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [directory, setDirectory] = React.useState(directoryTypes[0]);

    /**
     * General states for LDAP and AD Storages
     */

    const [adminUsername, setAdminUsername] = React.useState("");
    const [password, setPassword] = React.useState("");


    /**
     * Local storage Config
     */

    const [nameServerChecked, setNameServerChecked] = React.useState(false);

    /**
     * LDAP storage Config
     * 
     */
    const ldapFiltersTypes = [
        {value: 0, label: "UID"},
    ];

    const [baseDN, setBaseDN] = React.useState("");
    const ldapFiltersTypesItems = buildSelectMenuItems(ldapFiltersTypes);
    const [useStartTLS, setUseStartTLS] = React.useState("false")
    const [ldapFilter, setLdapFilter] = React.useState(ldapFiltersTypes[0]);

    const handleFilterIdChange = (event) => {
        setLdapFilter(ldapFiltersTypes[event.target.value]);
    }
    const handleUseStartTLSChange = (event) => {
        setUseStartTLS(event.target.value)
    }
    
    const handleNameServerChange = (event) => {
        setNameServerChecked(event.target.checked)
    }


    /**
     * Active Directory Storage Config
     */

    const [port, setPort] = React.useState("");
    const [host, setHost] = React.useState("");
    const [domainName, setDomainName] = React.useState("");
    const [isSSL, setIsSSL] = React.useState("false")

    const handleIsSSLChange = (event) => {
        setIsSSL(event.target.value)
    }

    /**
     * Form handle submit and server call
     */

    function setLocalStorageData(){
        const authSource = {};
        const settings = {
            "publicNameServer": "http://ns.jami.net",
            "publicNames": nameServerChecked
        };
    
        authSource['type'] = 'LOCAL';
        authSource['localAuthSettings'] = settings;
        return authSource;
    }

    function setLdapStorageData(){
        const authSource = {};
        const settings = {};

        settings['useStartTLS'] = (useStartTLS === 'true')
        settings['host'] = host
        settings['username'] = adminUsername
        settings['password'] = password
        settings['baseDN'] = baseDN
        settings['usernameField'] = ldapFilter.label

        settings['fieldMappings'] = {};
        settings['fieldMappings']['givenName'] = "FirstName";
        settings['fieldMappings']['sn'] = "LastName";
        settings['fieldMappings']['jpegPhoto'] = "ProfilePicture";
        settings['fieldMappings']['mail'] = "Email";
        settings['fieldMappings']['telephoneNumber'] = "PhoneNumber";
        settings['fieldMappings']['mobile'] = "MobileNumber";
        settings['fieldMappings']['facsimileTelephoneNumber'] = "FaxNumber";
        settings['fieldMappings']['extensionName'] = "PhoneNumberExtension";
        settings['fieldMappings']['o'] = "Organization";
        settings['fieldMappings']['uid'] = "Username";
      
        authSource['type'] = 'LDAP';
        authSource['ldapSettings'] = settings;
        return authSource;
    }

    function setAdStorageData(){
        const authSource = {};
        const settings = {};

        settings['isSSL'] = (isSSL === 'true')
        settings['host'] = host
        settings['port'] = parseInt(port, 10)
        settings['realm'] = domainName
        settings['username'] = adminUsername
        settings['password'] = password
    
        settings['fieldMappings'] = {};
        settings['fieldMappings']['sAMAccountName'] = "Username"
        settings['fieldMappings']['givenName'] = "FirstName";
        settings['fieldMappings']['sn'] = "LastName";
        settings['fieldMappings']['jpegPhoto'] = "ProfilePicture";
        settings['fieldMappings']['mail'] = "Email";
        settings['fieldMappings']['telephoneNumber'] = "PhoneNumber";
        settings['fieldMappings']['mobile'] = "MobileNumber";
        settings['fieldMappings']['facsimileTelephoneNumber'] = "FaxNumber";
        settings['fieldMappings']['extensionName'] = "PhoneNumberExtension";
        settings['fieldMappings']['o'] = "Organization";
        settings['fieldMappings']['uid'] = "Username";
    
        authSource['type'] = 'AD';
        authSource['activeDirectorySettings'] = settings;
        return authSource;
    }

    function callbackIdentityManagement(){
        auth.uri = '/api/install/settings'
        history.push('/');
    }

    function handleSubmit(e) {
        e.preventDefault();

        let data = {}
        if(directory.value == 0){
            data = setLocalStorageData()
        }else if(directory.value == 1){
            data = setLdapStorageData()
        }else{
            data = setAdStorageData()
        }

        axios(configApiCall(api_path_post_install_auth,'POST',data,null)).then((response)=>{
            console.log(response)
            callbackIdentityManagement()
        }).catch(()=>{
            props.setErrorMessage('The information provided appears to be incorrect, the connection to the directory has failed. Please check the information and credentials provided and try again.')
            props.setError(true)
        })

    }

    const handleChangeDirectoryType = (event) => {
        props.setError(false);
        setDirectory(directoryTypes[event.target.value]);
    };

    function returnForm(){
        if(directory.value == 0){
            return <LocalStorageForm 
                    nameServerChecked={nameServerChecked}
                    handleNameServerChange={handleNameServerChange} 
                    />
        }else if (directory.value == 1){
            return <LdapForm 
                    setAdminUsername={setAdminUsername}
                    setPassword={setPassword}
                    setHost={setHost}
                    setBaseDN={setBaseDN}
                    useStartTLS={useStartTLS}
                    handleUseStartTLSChange={handleUseStartTLSChange}
                    ldapFilter={ldapFilter}
                    ldapFiltersTypesItems={ldapFiltersTypesItems}
                    handleFilterIdChange={handleFilterIdChange}
                    />
        }else{
            return <AdStorageForm
                    setAdminUsername={setAdminUsername}
                    setPassword={setPassword}
                    setPort={setPort}
                    setHost={setHost}
                    setDomainName={setDomainName}
                    isSSL={isSSL}
                    handleIsSSLChange={handleIsSSLChange}
                    />
        }
    }

    return (
            
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
                <Typography variant="h5" gutterBottom color="primary">Identity Management</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="body1" gutterBottom >Select the type of user directory to be integrated with JAMS</Typography>
                        <Select
                        labelId="demo-simple-select-label"
                        fullWidth
                        value={directory.value}
                        onChange={handleChangeDirectoryType}
                        variant="outlined"
                        children={directoryTypesItems}
                        />
                    </Grid>                    
                </Grid>
                {returnForm()}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Set identity parameters
                </Button>
            </form>
    );
}