import React from 'react';
import { useHistory } from "react-router-dom";
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

import axios from 'axios';
import configApiCall from '../../api'
import { api_path_post_install_admin } from '../../globalUrls'

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

export default function CreateAdmin(props) {
    const classes = useStyles();
    const history = useHistory();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [error, setError] = React.useState(props.error);
    const [errorMessage, setErrorMessage] = React.useState(props.errorMessage);

    function createAdminCallBackHandler(response) {
        auth.setJWT(response.data['access_token'])
        auth.admin = true
        auth.authenticated = true
        auth.uri = 'start'
        history.push('/');
    }

    function handleSubmit(e) {
        e.preventDefault();
        const jsonData = {
            "username": username,
            "password": password
        }

        if(password != confirmPassword) {
            props.setErrorMessage("Passwords didn't match !");
            props.setError(true)
        }else {

            axios(configApiCall(api_path_post_install_admin, "PUT", jsonData, null)).then((response)=>{
                createAdminCallBackHandler(response);
            }).catch((error)=>{
                props.setErrorMessage(error)
                props.setError(true)
            })
        }
    }

    return (
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Typography variant="h5" gutterBottom color="primary">Create Administrator</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="email"
                            autoFocus
                            onChange={e => setUsername(e.target.value)}
                        />
                </Grid>
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
                        autoComplete="current-password"
                        onChange={e => setPassword(e.target.value)}
                    />
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
                        autoComplete="current-password"
                        onChange={e => setConfirmPassword(e.target.value)}
                    />

                </Grid>
            </Grid>

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
            >
                Continue
            </Button>

        </form>
    );
}