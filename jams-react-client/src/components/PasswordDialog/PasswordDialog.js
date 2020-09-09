import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components

import Button from "components/CustomButtons/Button.js";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import Grid from "@material-ui/core/Grid";

import InputAdornment from "@material-ui/core/InputAdornment";

import { Formik } from "formik";
import FormikField from "components/FormikField/FormikField";
import * as Yup from "yup";

import axios from "axios";
import configApiCall from "api.js";
import { api_path_put_update_user } from "globalUrls";

import VpnKeyIcon from "@material-ui/icons/VpnKey";
import RefreshIcon from "@material-ui/icons/Refresh";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";

import { CopyToClipboard } from "react-copy-to-clipboard";

let generator = require("generate-password");

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(1),
  },
  actionButtons: {
    display: "flex",
    justifyContent: "space-between",
  },
});

const useStyles = makeStyles(styles);

export default function PasswordDialog(props) {
  const classes = useStyles();

  const [copied, setCopied] = React.useState(false);
  const [generated, setGenerated] = React.useState(false);
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const passwordGenerator = () => {
    return generator.generate({
      length: 10,
      uppercase: false,
      numbers: true,
      symbols: true,
    });
  };

  const changePassword = (values) => {
    const data = {
      username: props.username,
      password: values.password,
    };

    axios(configApiCall(api_path_put_update_user, "PUT", data, null))
      .then(() => {
        props.setChangePasswordOpen(false);
      })
      .catch((error) => {
        console.log(
          "Updating user " +
            props.username +
            " password failed with error: " +
            error
        );
      });
    props.setChangePasswordOpen(false);
  };

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

  const getStatus = () => {
    if (copied)
      return (
        <span
          style={{
            fontSize: "12px",
            marginRight: "10px",
            marginTop: "14px",
            color: "rgba(0, 0, 0, 0.54)",
          }}
        >
          Copied
        </span>
      );
    else if (generated) {
      return (
        <span
          style={{
            fontSize: "12px",
            marginRight: "10px",
            marginTop: "14px",
            color: "rgba(0, 0, 0, 0.54)",
          }}
        >
          Generated
        </span>
      );
    } else return "";
  };

  React.useEffect(() => {
    setCopied(false);
    setGenerated(false);
  }, []);

  return (
    <div>
      <Dialog
        open={props.changePasswordOpen}
        onClose={props.handleClosechangePassword}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Formik
          initialValues={{
            password: "",
            passwordConfirmation: "",
          }}
          validationSchema={passwordSchema}
          onSubmit={changePassword}
        >
          {({ isValid, dirty, handleSubmit, values, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <DialogContentText id="change-password-description">
                  Change <strong>{props.username}'s</strong> password{" "}
                </DialogContentText>
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
                    <div style={{ display: "flex" }}>
                      {getStatus()}
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
                    </div>
                  }
                />
                <FormikField
                  name="passwordConfirmation"
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
              </DialogContent>
              <DialogActions>
                <Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      className={classes.button}
                      startIcon={<RefreshIcon />}
                      onClick={() => {
                        const newGeneratedPassword = passwordGenerator();
                        setFieldValue("password", newGeneratedPassword, false);
                        setFieldValue(
                          "passwordConfirmation",
                          newGeneratedPassword,
                          false
                        );
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
                  </Grid>
                  <Grid item className={classes.actionButtons}>
                    <Button
                      onClick={props.handleClosechangePassword}
                      color="primary"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disable={!isValid && !dirty}
                      color="info"
                      autoFocus
                    >
                      Update password
                    </Button>
                  </Grid>
                </Grid>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
}
