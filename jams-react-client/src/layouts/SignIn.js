import React from 'react';
import { useHistory } from "react-router-dom";
import {Formik} from 'formik';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MuiAlert from '@material-ui/lab/Alert';
import auth from '../auth.js'

import logo from "assets/img/logo-jams-blue.svg";
import * as Yup from "yup";
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            {new Date().getFullYear() + ' '}
            <Link color="info" href="https://savoirfairelinux.com">
                    Savoir-Faire-Linux
            </Link>{' '}
            {'.'}
        </Typography>
    );
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

export default function SignIn(props) {

    /**
     * Formik Validation Fields
     */

    const initialValues = {username: "", password:""};

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required("Username is required."),
        password: Yup.mixed()
            .required("Password is required."),
    });


    const classes = useStyles();
    const history = useHistory();
    const [error, setError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    React.useEffect(() => {
        if(auth.isAuthenticated() && auth.isInstalled()) {
            history.push('/admin/users');
        }
    })

    function handleSubmit(values) {
        const jsonData = {
            "username": values.username,
            "password": values.password
        }
        auth.login(jsonData, () => {
            if(auth.authenticated && auth.access_token !== ""){
                auth.checkLastKnownStep(() => {
                    auth.checkDirectoryType(() => {
                        if(auth.isInstalled){
                            history.push('/admin/users');
                        }
                        else{
                            history.push('/');
                        }
                    })
                })
            }else{
                setError(true)
                setErrorMessage("Login failed check your credentials")
            }
        })
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <img src={logo} style={{ width: "25em", paddingBottom: "20px" }} alt="logo"/>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                {error && <Alert severity="error">{errorMessage}</Alert>}
                <Formik validationSchema={validationSchema}
                        initialValues={initialValues}
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
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    autoFocus
                                    value={values.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.username && touched.username) && errors.username}
                                />
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
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={(errors.password && touched.password) && errors.password}
                                />
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary"/>}
                                    label="Remember me"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Sign In
                                </Button>
                                <Grid container>
                                    <Grid item xs>
                                        <Link href="#" variant="body2">
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="#" variant="body2">
                                            {"Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </form>
                        );
                    }
                    }
                </Formik>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}