import React, {useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import axios from 'axios';
import configApiCall from '../../api'
import { api_path_post_configuration_register_license } from '../../globalUrls'

import auth from '../../auth'

import i18next from "i18next";

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

export default function Subscription(props) {
    const classes = useStyles();
    const history = useHistory();
    const [activated, setActivated] = React.useState(false);

    useEffect(()=>{
        axios(configApiCall(api_path_post_configuration_register_license, "GET", null, null)).then((response)=>{
            if(response.data["activated"] == true) setActivated(true);
        }).catch((error)=>{
            if(error.response.status == 500){
                props.setErrorMessage(i18next.t("an_error_occured_while_getting_license_information", "An error occurred while getting subscription information!"));
                props.setSeverity("error");
                props.setError(true);
            }
        })
    })

    /**
     * Formik Validation Fields
     */
    const formik = useFormik({
        initialValues: {
            subscriptionCode: '',
        },
        validationSchema: Yup.object({
            subscriptionCode: Yup.string().required(i18next.t("subscription_code_is_required", "Subscription code is required")),
        }),

        onSubmit: values => {
            handleSubmit(values);
        },
    });

    function handleSubmit(values) {
        //e.preventDefault();
        const jsonData = {
            "base64License": values.subscriptionCode
        }

        axios(configApiCall(api_path_post_configuration_register_license, "POST", jsonData, null)).then(()=>{
            props.setErrorMessage(i18next.t("license_registred_successfully", "Subscription registered successfully!"));
            props.setSeverity("success");
            props.setError(true);
        }).catch((error)=>{
            if(error.response.status == 500){
                props.setErrorMessage(i18next.t("a_generic_occured_while_trying_to_load_license_or_license_could_not_be_found", "A generic occurred while trying to load your subscription or your subscription could not be found!"));
                props.setSeverity("error");
                props.setError(true);
            }
        })
    }

    if(!activated){
        return (
            <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
                <Typography variant="h5" gutterBottom color="primary">{i18next.t("paste_your_jams_enterprise_subscription_code_received_from_jami", "Paste your JAMS Enterprise subscription code received from the Jami store.")}</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="subscriptionCode"
                            label={i18next.t("subscription_code", "Subscription Code")}
                            name="subscriptionCode"
                            autoComplete="subscriptionCode"
                            autoFocus
                            {...formik.getFieldProps('subscriptionCode')}
                        />
                        {formik.touched.subscriptionCode && formik.errors.subscriptionCode ? (<span>{formik.errors.subscriptionCode}</span>) : null}
                    </Grid>
                </Grid>
    
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    {i18next.t("register", "Register")}
                </Button>
    
            </form>
        );
    }else{
        return(
            <div><p>{i18next.t("your_license_is_already_activated", "Your subscription is already activated!")}</p></div>
        );
    }

}