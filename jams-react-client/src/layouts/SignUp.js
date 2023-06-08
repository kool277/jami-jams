import React, { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import MuiAlert from "@material-ui/lab/Alert";
import Paper from "@material-ui/core/Paper";

import logo from "assets/img/jams_logo_no_gnu_package.svg";

import CustomizedSteppers from "components/CustomizedSteppers/CustomizedSteppers";
import CreateAdmin from "components/CreateAdmin/CreateAdmin";
import CaSetup from "components/CaSetup/CaSetup";
import IdentityManagement from "components/IdentityManagement/IdentityManagement";
import ServerParameters from "components/ServerParameters/ServerParameters";

import LanguagePicker from "../components/LanguagePicker/LanguagePicker";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      {new Date().getFullYear() + " "}
      <Link color="info" href="https://savoirfairelinux.com">
        Savoir-faire Linux Inc.
      </Link>
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
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
  },
}));

export default function SignUp(props) {
  const classes = useStyles();
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("Test");

  useEffect(() => {
    //request the server to check for the step to return
  });

  function returnStep() {
    if (props.step === 0) {
      return (
        <CreateAdmin setError={setError} setErrorMessage={setErrorMessage} />
      );
    } else if (props.step === 1) {
      return <CaSetup setError={setError} setErrorMessage={setErrorMessage} />;
    } else if (props.step === 2) {
      return (
        <IdentityManagement
          setError={setError}
          setErrorMessage={setErrorMessage}
        />
      );
    } else if (props.step === 3) {
      return (
        <ServerParameters
          setError={setError}
          setErrorMessage={setErrorMessage}
        />
      );
    }
  }
  return (
    <Container component="main" maxWidth="sm">
      <Paper className={classes.paper}>
        <CssBaseline />
        <img src={logo} className={classes.logo} alt="Logo Jami" />
        <CustomizedSteppers step={props.step} />
        {error && errorMessage && (
          <Alert severity="error">{errorMessage}</Alert>
        )}
        {returnStep()}

        <Box mt={8}>
          <Copyright />
        </Box>
        <Box mt={8} justifyContent="center">
          <LanguagePicker navigationTarget={"/"} />
        </Box>
      </Paper>
    </Container>
  );
}
