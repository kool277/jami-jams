import React from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MuiAlert from '@material-ui/lab/Alert';
import CustomPopupState from '../CustomPopupState/CustomPopupState';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';

import * as tool from "../../tools";

import axios from 'axios';
import configApiCall from '../../api'
import {api_path_post_install_server} from '../../globalUrls'
import auth from 'auth';

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

export default function ServerParameters(props) {

    const certificateRevocationTypes = [
        {value: 300000, label: "5 minutes"},
        {value: 600000, label: "10 minutes"},
        {value: 900000, label: "15 minutes"},
        {value: 1800000, label: "30 minutes"},
        {value: 3600000, label: "60 minutes"},
    ];

    const deviceLifetimeTypes = [
        {value: 2629746000, label: "1 Month"},
        {value: 7889238000, label: "3 Months"},
        {value: 15778476000, label: "6 Months"},
        {value: 31556952000, label: "1 Year"},
        {value: 157784760000, label: "5 Years"},
    ]

    const userAccountLifetimeTypes = [
        {value: 31556952000, label: "1 Year"},
        {value: 157784760000, label: "5 Years"},
        {value: 315569520000, label: "10 Years"},
    ]

    const certificateRevocationTypesItems = tool.buildSelectMenuItems(certificateRevocationTypes);
    const deviceLifetimeTypesItems = tool.buildSelectMenuItems(deviceLifetimeTypes);
    const userAccountLifetimeTypesItems = tool.buildSelectMenuItems(userAccountLifetimeTypes);

    const classes = useStyles();
    const history = useHistory();
    const [error, setError] = React.useState(props.error);
    const [domain, setDomain] = React.useState("");
    const [certificateRevocation, setCertificateRevocation] = React.useState(certificateRevocationTypes[0])
    const [deviceLifetime, setDeviceLifetime] = React.useState(deviceLifetimeTypes[0])
    const [userAccountLifetime, setUserAccountLifetime] = React.useState(userAccountLifetimeTypes[0])
    const [sipConfigurationTemplate, setSIPCertificateTemplate] = React.useState(null);
    const [userlifeDisabled, setUserlifeDisabled] = React.useState(false);

    React.useEffect(() => {
        if(deviceLifetime.value <= userAccountLifetime.value){
            setUserlifeDisabled(false);
        }
        else{
            setUserlifeDisabled(true);
        }
    }, [deviceLifetime, userAccountLifetime]);

    function callBackServerParameters(){
        auth.installed = true
        auth.authenticated = true
        auth.admin = true
        auth.checkDirectoryType(() => {
            history.push('/admin');
        })
    }

    function handleSubmit(e) {
        e.preventDefault();
        let jsonData = {};
        let re = new RegExp(/^http[s]?:\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*$/);
        if(domain.match(re)){
            jsonData = {
                'serverDomain': domain,
                'crlLifetime': certificateRevocation.value,
                'deviceLifetime': deviceLifetime.value,
                'userLifetime': userAccountLifetime.value,
                'sipConfig': sipConfigurationTemplate,
                'signingAlgorithm': "SHA512WITHRSA"
            }
            axios(configApiCall(api_path_post_install_server, "POST", jsonData, null)).then((response)=>{
                callBackServerParameters()
            }).catch((error)=>{
                setError(error);
                console.log('Error installin server parameters: ' + error );
            })
        }
        else{
            props.setError(true)
            props.setErrorMessage("Please enter a valid CORS domain URL.");
        }
        // Check https://www.geeksforgeeks.org/file-uploading-in-react-js/ for the file upload
    }

    const handleCertificateRevocationChange = (event) => {
        setCertificateRevocation(tool.retrieveArrayElement(event.target.value,certificateRevocationTypes))
    }

    const handleDeviceLifetimeChange = (event) => {
        setDeviceLifetime(tool.retrieveArrayElement(event.target.value, deviceLifetimeTypes));
    }

    const handleUserAccountLifetimeChange = (event) => {
        setUserAccountLifetime(tool.retrieveArrayElement(event.target.value, userAccountLifetimeTypes));
    }


    const handleSipConfigurationTemplateChange = (event) => {
        setSIPCertificateTemplate(event.target.files[0])
    }

    return (
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Typography variant="h5" gutterBottom color="primary">Server Parameters</Typography>
            <Typography variant="body1" gutterBottom >The global parameters cover the general configuration of the server's engine.</Typography>
            <Typography variant="subtitle1" gutterBottom >CORS Domain Name<CustomPopupState message="Set the domain of the web client server to connect to the JAMS admin dashboard and Jami accounts. It is also used to define where the clients should download CRLs and submit OCSP queries. In case you are running a proxied instance (i.e. JAMS behind IIS), please make sure to set this field correctly, otherwise devices will not be able to download CRLs or validate certificates."/></Typography>
            <Typography variant="body1" gutterBottom >The domain name of your web client server. Requires http:// or https://</Typography>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="domain"
                label="Domain"
                name="domain"
                autoComplete="domain"
                autoFocus
                onChange={e => setDomain(e.target.value)}
            />
            <Typography variant="subtitle1" gutterBottom >Certificate Revocation List Lifetime<CustomPopupState message="Set the domain of the web client server to connect to the JAMS admin dashboard and Jami accounts. It is also used to define where the clients should download CRLs and submit OCSP queries. In case you are running a proxied instance (i.e. JAMS behind IIS), please make sure to set this field correctly, otherwise devices will not be able to download CRLs or validate certificates."/></Typography>
            <Select
            labelId="certificate-revocation-select-label"
            fullWidth
            value={certificateRevocation.value}
            onChange={handleCertificateRevocationChange}
            variant="outlined"
            children={certificateRevocationTypesItems}
            />
            <Typography variant="subtitle1" gutterBottom >Device Lifetime</Typography>
            <Select
            labelId="device-lifetime-select-label"
            fullWidth
            value={deviceLifetime.value}
            onChange={handleDeviceLifetimeChange}
            variant="outlined"
            children={deviceLifetimeTypesItems}
            />
            <Typography variant="subtitle1" gutterBottom >User Account Lifetime</Typography>
            <Select
            labelId="user-account-lifetime-select-label"
            fullWidth
            value={userAccountLifetime.value}
            onChange={handleUserAccountLifetimeChange}
            isDisabled={userlifeDisabled}
            variant="outlined"
            children={userAccountLifetimeTypesItems}
            />
            <Typography variant="subtitle1" gutterBottom >SIP Configuration Template</Typography>
            <Input
            fullWidth
            type="file"
            onChange={handleSipConfigurationTemplateChange}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
            >
                Set Server Parameters
            </Button>

        </form>
    );
}