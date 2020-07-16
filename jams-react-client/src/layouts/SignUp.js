import React, { useEffect } from 'react';
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
import Paper from '@material-ui/core/Paper';

import logo from "assets/img/logo-jams-blue.svg";

import CustomizedSteppers from 'components/CustomizedSteppers/CustomizedSteppers';
import CreateAdmin from 'components/CreateAdmin/CreateAdmin';
import CaSetup from 'components/CaSetup/CaSetup';
import IdentityManagement from 'components/IdentityManagement/IdentityManagement';
import ServerParameters from 'components/ServerParameters/ServerParameters';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://savoirfairelinux.com/">
                JAMS by Savoir-faire Linux
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
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
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
          marginTop: theme.spacing(6),
          marginBottom: theme.spacing(6),
          padding: theme.spacing(3),
        },
    },
    logo: {
        width: "25em",
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
    }
}));

export default function SignUp(props) {
    const classes = useStyles();
    const [error, setError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("Test");
    const [step, setStep] = React.useState(props.step);

    useEffect(()=>{
        //request the server to check for the step to return
    });

    function returnStep(){
        if(step == 0) {
            return <CreateAdmin setError={setError} setErrorMessage={setErrorMessage}  />
        }else if (step == 1) {
            return <CaSetup setError={setError} setErrorMessage={setErrorMessage} />
        }else if (step == 2) {
            return <IdentityManagement setError={setError} setErrorMessage={setErrorMessage} />
        }else if (step == 3) {
            return <ServerParameters setError={setError} setErrorMessage={setErrorMessage} />
        }
    }
    return (
        <Container component="main" maxWidth="sm">
            <Paper className={classes.paper}>
            <CssBaseline />
                <img src={logo} className={classes.logo} />
            <CustomizedSteppers step={step}/>
            {error && errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {returnStep()}
        
            <Box mt={8}>
                <Copyright/>
            </Box>
            </Paper>
        </Container>
    );
}