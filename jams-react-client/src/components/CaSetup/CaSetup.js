import React from 'react';
import {useHistory} from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import CountrySelect from "components/CountrySelect/CountrySelect.js";
import CustomizedSteppers from '../CustomizedSteppers/CustomizedSteppers'

import auth from '../../auth'
import axios from 'axios';
import configApiCall from '../../api'
import { api_path_post_install_ca } from '../../globalUrls'
import Select from "@material-ui/core/Select";
import * as tool from "../../tools";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";

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

export default function CaSetup(props) {
    const history = useHistory();
    const [error, setError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const getCertificateOptions = [
        {value: 0, label: "Create a self-signed Certificate Authority"},
        {value: 1, label: "Import existing Certificate Authority"},
    ];

    const validityPeriods = [
        {value: 157784630000, label: "5 years"},
        {value: 315569260000, label: "10 years"},
    ];

    const certificateOptionsItems = tool.buildSelectMenuItems(getCertificateOptions);
    const validityPeriodsItems = tool.buildSelectMenuItems(validityPeriods);
    const classes = useStyles();

    const [commonname, setCommonName] = React.useState("");
    const [state, setState] = React.useState("");
    const [city, setCity] = React.useState("");
    const [organization, setOrganization] = React.useState("");
    const [organizationUnit, setOrganizationUnit] = React.useState("");
    const [country, setCountry] = React.useState("");
    const [certificateFile, setCertificateFile] = React.useState("");
    const [privKeyFile, setPrivKeyFile] = React.useState("");




    const [certificateOpt, setCertificateOpt] = React.useState(getCertificateOptions[0]);
    const [validityPeriod, setValidityPeriod] = React.useState(validityPeriods[0]);


    function handleInstallCA(data) {
        if(data.status == 500 || data.status == 512 || data.status == 513) {
            props.setError(true)
            props.setErrorMessage("An unknown error occurred while installing the CA. Please try again.");
        }
         else if (data.status == 200){
            auth.uri = '/api/install/auth';
            history.push('/');
        }

    }

    function onCountryChange(values) {
        setCountry(values['country'].label);
    }

    const handleCertifOptionChange = (event) => {
        props.setError(false);
        setCertificateOpt(getCertificateOptions[event.target.value]);
    };

    const handleValidPeriodChange = (event) => {
        props.setError(false);
        setValidityPeriod(validityPeriods[event.target.value]);
    };

    const handleCertificateFileChange = (event) => {
        console.log(certificateFile);
        setCertificateFile(event.target.files[0])
        console.log(certificateFile);

    }

    const handlePrivKeyFileChange = (event) => {
        setPrivKeyFile(event.target.files[0])
    }

    function handleSubmit(e) {
        e.preventDefault();
        let jsonData = {};
        if(certificateOpt.value == 0){
            jsonData = {
                'fields': {
                    'commonName': commonname,
                    'organizationalUnit': organizationUnit,
                    'organization': organization,
                    'city': city,
                    'state': state,
                    'country': country,
                    'lifetime': validityPeriod.value
                }
            }
        }
        else if(certificateOpt.value == 1){
            jsonData = {
                'caCertificate': certificateFile,
                'caKey': privKeyFile
            }
            console.log(certificateFile);
            console.log(privKeyFile);
        }

        axios(configApiCall(api_path_post_install_ca, "POST", jsonData, null)).then((response)=>{
            handleInstallCA(response);
            console.log(response);
        }).catch((error)=>{
            props.setError(error);
            console.log('Error installing CA Setup: ' + error );
        })
    }
    if(certificateOpt.value == 0){
        return (
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
                <h4>
                    Select an option for setting-up the certificate authority that will be used to sign all Jami accounts generated on this JAMS instance.
                </h4>
                <Select
                    labelId="demo-simple-select-label"
                    fullWidth
                    value={certificateOpt.value}
                    onChange={handleCertifOptionChange}
                    variant="outlined"
                    children={certificateOptionsItems}
                />

                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="commonname"
                    label="Common Name"
                    name="commonname"
                    autoComplete="commonname"
                    autoFocus
                    onChange={e => setCommonName(e.target.value)}
                />

                <CountrySelect onCountryChange={onCountryChange} />

                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="state"
                    label="State"
                    id="state"
                    autoComplete="state"
                    onChange={e => setState(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="city"
                    label="City"
                    id="city"
                    autoComplete="city"
                    onChange={e => setCity(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="organization"
                    label="Organization"
                    id="organization"
                    autoComplete="organization"
                    onChange={e => setOrganization(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="organizationunit"
                    label="Organization Unit"
                    id="organizationunit"
                    autoComplete="organizationunit"
                    onChange={e => setOrganizationUnit(e.target.value)}
                />
                <Select
                    labelId="demo-simple-select-label"
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    value={validityPeriod.value}
                    onChange={handleValidPeriodChange}
                    variant="outlined"
                    children={validityPeriodsItems}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Generate Self-Signed Certificate Authority
                </Button>

            </form>
        );
    }
    else if(certificateOpt.value == 1){
        return (
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
                <h4>
                    Select an option for setting-up the certificate authority that will be used to sign all Jami accounts generated on this JAMS instance.
                </h4>

                <Select
                    labelId="demo-simple-select-label"
                    fullWidth
                    value={certificateOpt.value}
                    onChange={handleCertifOptionChange}
                    variant="outlined"
                    children={certificateOptionsItems}
                />
                <Typography variant="subtitle1" gutterBottom >CA file (PEM-encoded)</Typography>
                <Input
                    fullWidth
                    type="file"
                    onChange={handleCertificateFileChange}
                />
                <Typography variant="subtitle1" gutterBottom >Key File (PEM-encoded)</Typography>
                <Input
                    fullWidth
                    type="file"
                    onChange={handlePrivKeyFileChange}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Import Certificate Authority
                </Button>

            </form>
        );
    }
}