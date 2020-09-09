import React from "react";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import FormikField from "components/FormikField/FormikField";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import RefreshIcon from "@material-ui/icons/Refresh";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import InputAdornment from "@material-ui/core/InputAdornment";

import axios from "axios";
import configApiCall from "../../api";
import { api_path_put_update_user } from "../../globalUrls";

import { CopyToClipboard } from "react-copy-to-clipboard";

let generator = require("generate-password");

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
  button: {
    margin: theme.spacing(1),
  },
}));

export default function UpdatePassword(props) {
  const classes = useStyles();
  const history = useHistory();

  const [copied, setCopied] = React.useState(false);
  const [generated, setGenerated] = React.useState(false);
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const changePassword = (values) => {
    const data = {
      username: props.username,
      password: values.password,
    };

    axios(configApiCall(api_path_put_update_user, "PUT", data, null))
      .then(() => {
        props.setSeverity("success");
        props.setErrorMessage("Admin password updated successfully!");
        props.setError(true);
      })
      .catch((error) => {
        props.setSeverity("error");
        props.setErrorMessage(
          "Updating user " +
            props.username +
            " password failed with error: " +
            error
        );
        props.setError(true);
      });
  };

  const passwordGenerator = () => {
    return generator.generate({
      length: 10,
      uppercase: false,
      numbers: true,
      symbols: true,
    });
  };

  /**
   * Formik Validation Fields
   */

  const passwordSchema = Yup.object().shape({
    password: Yup.string().required("Password is required"),
    passwordConfirmation: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });

  const handleMouseDownPassword = () => {
    setPasswordVisible(true);
  };
  const handleMouseUpPassword = () => {
    setPasswordVisible(false);
  };

  return (
    <Formik
      initialValues={{
        password: "",
        confirmPassword: "",
      }}
      validationSchema={passwordSchema}
      onSubmit={changePassword}
    >
      {({
        isValid,
        dirty,
        handleSubmit,
        values,
        setFieldValue,
        touched,
        errors,
      }) => (
        <form onSubmit={handleSubmit} className={classes.form}>
          <Typography variant="h5" gutterBottom color="primary">
            Enter the following information below to change your admin password.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <FormikField
                name="password"
                label="Password"
                placeholder="Password"
                type={passwordVisible ? "text" : "password"}
                startAdornment={
                  <InputAdornment position="start">
                    <VpnKeyIcon />
                  </InputAdornment>
                }
                endAdornment={
                  <IconButton
                    aria-label="toggle password visibility"
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                  >
                    {passwordVisible ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                }
              />
              {touched.password && errors.password ? (
                <span>{errors.password}</span>
              ) : null}
            </Grid>

            <Grid item xs={6}>
              <FormikField
                name="confirmPassword"
                label="Confirm password"
                placeholder="Confirm password"
                type={passwordVisible ? "text" : "password"}
                startAdornment={
                  <InputAdornment position="start">
                    <VpnKeyIcon />
                  </InputAdornment>
                }
                endAdornment={
                  <IconButton
                    aria-label="toggle password visibility"
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                  >
                    {passwordVisible ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                }
              />
              {touched.confirmPassword && errors.confirmPassword ? (
                <span>{errors.confirmPassword}</span>
              ) : null}
            </Grid>

            <Grid item align="left" xs={12} sm={12} md={6}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.button}
                startIcon={<RefreshIcon />}
                onClick={() => {
                  const newGeneratedPassword = passwordGenerator();
                  setFieldValue("password", newGeneratedPassword, false);
                  setFieldValue("confirmPassword", newGeneratedPassword, false);
                  setCopied(false);
                  setGenerated(true);
                }}
              >
                {"Generate"}
              </Button>
              <CopyToClipboard
                text={values.password}
                onCopy={() => {
                  setCopied(true);
                  setGenerated(false);
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  className={classes.button}
                  startIcon={<FileCopyIcon />}
                >
                  Copy to clipboard
                </Button>
              </CopyToClipboard>
              {copied ? (
                <span style={{ marginLeft: "10px" }}>Copied</span>
              ) : null}
              {generated ? (
                <span style={{ marginLeft: "10px" }}>Generated</span>
              ) : null}
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disable={!isValid && !dirty}
            className={classes.submit}
          >
            Change Admin Password
          </Button>
        </form>
      )}
    </Formik>
  );
}
