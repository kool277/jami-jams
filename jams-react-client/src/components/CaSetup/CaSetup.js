import React from 'react';
import {useHistory} from "react-router-dom";
import { Formik, Field } from "formik";
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import CountrySelect from "components/CountrySelect/CountrySelect.js";

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

    /**
     * Formik Validation Fields
     */

    const initialValuesform1 = {commonname: "", state:"", city:"", organization:"", organizationunit:"", country:""};

    const initialValuesform2 = {certificatefile: "", privkeyfile:""};

    const validationSchemaform1 = Yup.object().shape({
        commonname: Yup.string()
            .required("Common name is required."),
        state: Yup.string()
            .required("State is required."),
        city: Yup.string()
            .required("City is required."),
        organization: Yup.string()
            .required("Organization is required."),
        organizationunit: Yup.string()
            .required("Organization unit is required."),
        country: Yup.string()
            .required("Country is required."),
    });

    const validationSchemaform2 = Yup.object().shape({
        certificatefile: Yup.mixed()
            .required("Certificate file is required."),
        privkeyfile: Yup.mixed()
            .required("Private key file is required."),
    });


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

    const [certificateOpt, setCertificateOpt] = React.useState(getCertificateOptions[0]);
    const [validityPeriod, setValidityPeriod] = React.useState(validityPeriods[0]);


    function handleInstallCA(data) {
        if(data.status === 500 || data.status === 512 || data.status === 513) {
            props.setError(true)
            props.setErrorMessage("An unknown error occurred while installing the CA. Please try again.");
        }
        else if (data.status === 200){
            auth.uri = '/api/install/auth';
            history.push('/');
        }

    }

    const handleCertifOptionChange = (event) => {
        props.setError(false);
        setCertificateOpt(getCertificateOptions[event.target.value]);
    };

    const handleValidPeriodChange = (event) => {
        props.setError(false);
        setValidityPeriod(validityPeriods[event.target.value]);
    };

    const handleSubmit = (values) => {
        let jsonData = {};
        if(certificateOpt.value === 0){
            jsonData = {
                'fields': {
                    'commonName': values.commonname,
                    'organizationalUnit': values.organizationUnit,
                    'organization': values.organization,
                    'city': values.city,
                    'state': values.state,
                    'country': values.country,
                    'lifetime': validityPeriod.value
                }
            }
        }
        else if(certificateOpt.value === 1){
            jsonData = {
                'caCertificate': values.certificatefile,
                'caKey': values.privkeyfile
            }
        }

        axios(configApiCall(api_path_post_install_ca, "POST", jsonData, null)).then((response)=>{
            handleInstallCA(response);
        }).catch((error)=>{
            props.setError(error);
            console.log('Error installing CA Setup: ' + error );
        })
    }
    if(certificateOpt.value === 0){
        return (
            <Formik
                validationSchema={validationSchemaform1}
                initialValues={initialValuesform1}
                onSubmit={values => {
                    handleSubmit(values);
                }}
            >
                {(props) => {
                    const {
                        values,
                        touched,
                        errors,
                        handleSubmit,
                        handleChange,
                        handleBlur,
                    } = props;
                    return (
                        <form className={classes.form} noValidate onSubmit={handleSubmit}>
                            <h4>
                                Select an option for setting-up the certificate authority that will be used to sign all Jami
                                accounts generated on this JAMS instance.
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
                                value={values.commonname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.commonname && touched.commonname) && errors.commonname}
                            />

                            <CountrySelect defaultValue={values.country} {...props}/>
                            {touched.country && errors.country ? (<span class="spanError">{errors.country}</span>) : null}

                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="state"
                                label="State"
                                id="state"
                                autoComplete="state"
                                value={values.state}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.state && touched.state) && errors.state}
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
                                value={values.city}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.city && touched.city) && errors.city}
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
                                value={values.organization}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.organization && touched.organization) && errors.organization}
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
                                value={values.organizationunit}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={(errors.organizationunit && touched.organizationunit) && errors.organizationunit}
                            />

                            <Select
                                labelId="demo-simple-select-label"
                                margin="normal"
                                fullWidth
                                variant="outlined"
                                value={validityPeriod.value}
                                onChange={handleValidPeriodChange}
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
                }
            </Formik>
        );
    }
    else if(certificateOpt.value === 1){
        return (
            <Formik
                validationSchema={validationSchemaform2}
                initialValues={initialValuesform2}
                onSubmit={values => {
                    handleSubmit(values);
                }}
            >{(props) => {
                const {
                    handleSubmit,
                    handleChange,
                } = props;
                return (
                    <form className={classes.form} noValidate onSubmit={handleSubmit}>
                        <h4>
                            Select an option for setting-up the certificate authority that will be used to sign all Jami
                            accounts generated on this JAMS instance.
                        </h4>

                        <Select
                            labelId="demo-simple-select-label"
                            fullWidth
                            value={certificateOpt.value}
                            onChange={handleCertifOptionChange}
                            variant="outlined"
                            children={certificateOptionsItems}
                        />
                        <Typography variant="subtitle1" gutterBottom>CA file (PEM-encoded)</Typography>
                        <Field name="certificatefile">
                            {({field, form}) => (
                                <div>
                                    <Input
                                        fullWidth
                                        type="file"
                                        onChange={handleChange}
                                        {...field}
                                    />
                                    {form.errors.certificatefile && form.touched.certificatefile? <span class="spanError">{form.errors.certificatefile}</span> : null}
                                </div>
                            )
                            }
                        </Field>
                        <Typography variant="subtitle1" gutterBottom>Key File (PEM-encoded)</Typography>
                        <Field name="privkeyfile">
                            {({
                                  field,
                                  form,
                                  meta,
                              }) => (
                                <div>
                                    <Input
                                        fullWidth
                                        type="file"
                                        {...field}
                                    />
                                    {meta.touched && meta.error && (<span class="spanError">{meta.error}</span>)}
                                </div>
                            )
                            }
                        </Field>

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
            }}
            </Formik>
        );
    }
}