import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import MuiAlert from "@mui/material/Alert";
import auth from "../auth";

import LanguagePicker from "../components/LanguagePicker/LanguagePicker";

import i18next from "i18next";

import logo from "assets/img/jams_logo_no_gnu_package.svg";
import * as Yup from "yup";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      {new Date().getFullYear() + " "}
      <Link href="https://savoirfairelinux.com">
        Savoir-faire Linux Inc.
      </Link>{" "}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
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
}));

export default function SignIn() {
  /**
   * Formik Validation Fields
   */

  const initialValues = { username: "", password: "" };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required."),
    password: Yup.mixed().required("Password is required."),
  });

  const classes = useStyles();
  const history = useHistory();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (auth.isAuthenticated() && auth.isInstalled()) {
      if (auth.hasAdminScope()) history.push("/users");
      else {
        if (auth.getUsername() !== null) {
          history.push(`/user/${auth.getUsername()}`);
        }
      }
    }
  });

  function handleSubmit(values) {
    const jsonData = {
      username: values.username,
      password: values.password,
    };
    auth.login(jsonData, () => {
      if (auth.authenticated && auth.access_token !== "") {
        auth.checkLastKnownStep(() => {
          auth.checkDirectoryType(() => {
            if (auth.isServerInstalled()) {
              if (auth.hasAdminScope()) history.push("/users");
              else {
                if (auth.getUsername() !== null) {
                  history.push(`/user/${auth.getUsername()}`);
                }
              }
            } else {
              history.push("/");
            }
          });
        });
      } else {
        setError(true);
        setErrorMessage(
          i18next.t("login_failed", "Login failed. Check your credentials.")
        );
      }
    });
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <img
          src={logo}
          style={{ width: "25em", paddingBottom: "20px" }}
          alt="logo"
        />
        <Typography component="h1" variant="h5">
          {i18next.t("sign_in", "Sign In")}
        </Typography>
        {error && <Alert severity="error">{errorMessage}</Alert>}
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
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
                  label={i18next.t("username", "Username")}
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={
                    errors.username && touched.username && errors.username
                  }
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label={i18next.t("password", "Password")}
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={
                    errors.password && touched.password && errors.password
                  }
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  {i18next.t("sign_in", "Sign In")}
                </Button>
              </form>
            );
          }}
        </Formik>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
      <Box mt={8} justifyContent="center">
        <LanguagePicker navigationTarget={"/"} />
      </Box>
    </Container>
  );
}
