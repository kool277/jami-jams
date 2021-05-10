import React from "react";
import { Formik } from "formik";
import FormikField from "components/FormikField/FormikField";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
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

import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import axios from "axios";
import configApiCall from "../../api";
import { api_path_put_update_user } from "../../globalUrls";

import { CopyToClipboard } from "react-copy-to-clipboard";

import i18next from "i18next";

import LanguagePicker from "../../components/LanguagePicker/LanguagePicker";

const pjson = require('../../../package.json');

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
  button: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));

export default function General(props) {
  const classes = useStyles();

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
        props.setErrorMessage(i18next.t("admin_password_updated_successfully", "Administrator password successfully updated."));
        props.setError(true);
      })
      .catch((error) => {
        props.setSeverity("error");
        props.setErrorMessage(
          i18next.t("updating_user", "Updating user ") +
            props.username +
            i18next.t("password_failed", " password failed with error: ") +
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
    password: Yup.string().required(i18next.t("password_is_required", "Password is required!")),
    passwordConfirmation: Yup.string().oneOf(
      [Yup.ref("password"), null],
      i18next.t("password_must_match", "Passwords must match")
    ),
  });

  const handleMouseDownPassword = () => {
    setPasswordVisible(true);
  };
  const handleMouseUpPassword = () => {
    setPasswordVisible(false);
  };

  return (
    <GridContainer>
    <Grid item xs={12} sm={12} md={6}>
    <Card profile>
      <CardHeader color="info" stats icon></CardHeader>
      <CardBody profile>
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
          <Grid container spacing={2}>
            <Grid item lg={6} style={{ display: "flex"}}>
              <Typography variant="p" gutterBottom color="primary">
                {i18next.t("change_language", "Change language")}
              </Typography>
            </Grid>
            <Grid item lg={6} ><LanguagePicker navigationTarget={"/admin/settings"} /></Grid>
            <Grid item lg={6} >
              <Typography variant="p" gutterBottom color="primary">
                {i18next.t("enter_the_following_information_below_to_change_your_admin_password", "Enter the following information to change your admin password.")}
              </Typography>
            </Grid>
            <Grid item lg={6} >
              <FormikField
                name="password"
                label={i18next.t("password", "Password")}
                placeholder={i18next.t("password", "Password")}
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
                handleChange={() => {}}
                onKeyUpError={false}
                onKeyUpErrorMessage=""
              />
              {touched.password && errors.password ? (
                <span>{errors.password}</span>
              ) : null}

              <FormikField
                name="confirmPassword"
                label={i18next.t("Confirm password", "Confirm password")}
                placeholder={i18next.t("Confirm password", "Confirm password")}
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
                handleChange={() => {}}
                onKeyUpError={false}
                onKeyUpErrorMessage=""
              />
              {touched.confirmPassword && errors.confirmPassword ? (
                <span>{errors.confirmPassword}</span>
              ) : null}

              <Button
                variant="contained"
                color="info"
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
                {i18next.t("generate", "Generate")}
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
                  color="info"
                  size="large"
                  className={classes.button}
                  startIcon={<FileCopyIcon />}
                >
                  {i18next.t("copy_to_clipboard", "Copy to clipboard")}
                </Button>
              </CopyToClipboard>
              {copied ? (
                <span style={{ marginLeft: "10px" }}>{i18next.t("copied", "Copied")}</span>
              ) : null}
              {generated ? (
                <span style={{ marginLeft: "10px" }}>{i18next.t("generated", "Generated")}</span>
              ) : null}

            </Grid>
            <Grid item lg={6}></Grid>
            <Grid item lg={6}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disable={!isValid && !dirty}
                className={classes.submit}
              >
                {i18next.t("change_admin_password", "Change administrator password")}
              </Button>
            </Grid>
            <Grid item lg={6}>
                Version {pjson.version.slice(0, 3)}
            </Grid>
          </Grid>

        </form>
      )}
    </Formik>
    </CardBody>
    </Card>
    </Grid>
    </GridContainer>
  );
}
