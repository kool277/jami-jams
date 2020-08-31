import React from 'react';
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
import { api_path_put_update_user } from '../../globalUrls'

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

export default function UpdatePassword(props) {
    const classes = useStyles();
    const history = useHistory();

    const changePassword = (values) => {
        axios(configApiCall(api_path_put_update_user+'?username='+props.username+'&password='+values.password, 'PUT', null, null)).then(()=>{
            props.setSeverity("success");
            props.setErrorMessage("Admin password updated successfully!");
            props.setError(true);
        }).catch((error)=> {
            props.setSeverity("error");
            props.setErrorMessage("Updating user " + props.username + ' password failed with error: ' + error);
            props.setError(true);
        });
    }

    /**
     * Formik Validation Fields
     */
    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',

        },
        validationSchema: Yup.object({
            password: Yup.string()
                .max(50, 'Must be 50 characters or less')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .max(50, 'Must be 50 characters or less')
                .required('Password confirmation is required'),
        }),

        onSubmit: values => {
            changePassword(values);
        },
    });

    return (
        <form className={classes.form} onSubmit={formik.handleSubmit}>
            <Typography variant="h5" gutterBottom color="primary">Enter the following information below to change your admin password.</Typography>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password ? (<span>{formik.errors.password}</span>) : null}

                </Grid>

                <Grid item xs={6}>

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        {...formik.getFieldProps('confirmPassword')}
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (<span>{formik.errors.confirmPassword}</span>) : null}

                </Grid>
            </Grid>

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
            >
                Change Admin Password
            </Button>

        </form>
    );
}