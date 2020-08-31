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
                props.setErrorMessage("An error occured while getting license information!");
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
            subscriptionCode: Yup.string().required('Subscription code is required'),
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
            props.setErrorMessage("License registred successfully!");
            props.setSeverity("success");
            props.setError(true);
        }).catch((error)=>{
            if(error.response.status == 500){
                props.setErrorMessage("A generic occurred while trying to load your license or your license could not be found!");
                props.setSeverity("error");
                props.setError(true);
            }
        })
    }

    if(!activated){
        return (
            <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
                <Typography variant="h5" gutterBottom color="primary">Paste your JAMS Enterprise subscription code received from the Jami store.</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="subscriptionCode"
                            label="Subscription Code"
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
                    Register
                </Button>
    
            </form>
        );
    }else{
        return(
            <div><p>Your license is already activated!</p></div>
        );
    }

}