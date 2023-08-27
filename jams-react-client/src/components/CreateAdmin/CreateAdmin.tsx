import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";

import axios from "axios";
import configApiCall from "../../api";
import { api_path_post_install_admin } from "../../globalUrls";

import auth from "../../auth";

import i18next from "i18next";
import { Theme } from "@mui/material";

const useStyles = makeStyles((theme: Theme) => ({
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

export default function CreateAdmin(props) {
  const classes = useStyles();
  const history = useHistory();

  /**
   * Formik Validation Fields
   */
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .max(
          60,
          i18next.t(
            "must_be_60_characters_or_less",
            "Must be 60 characters or less"
          )
        )
        .required(
          i18next.t("username_is_required", "Username is required!") as string
        ),
      password: Yup.string()
        .max(
          50,
          i18next.t(
            "must_be_50_characters_or_less",
            "Must be 50 characters or less"
          )
        )
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref("password"), null],
          i18next.t("password_must_match", "Passwords must match") as string
        )
        .max(
          50,
          i18next.t(
            "must_be_50_characters_or_less",
            "Must be 50 characters or less"
          )
        )
        .required(
          i18next.t(
            "password_confirmation_required",
            "Password confirmation is required."
          )
        ),
    }),

    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  function createAdminCallBackHandler(response) {
    auth.setJWT(response.data["access_token"]);
    auth.admin = true;
    auth.authenticated = true;
    auth.uri = "start";
    history.push("/");
  }

  function handleSubmit(values) {
    //e.preventDefault();
    const jsonData = {
      username: values.username,
      password: values.password,
    };
    axios(configApiCall(api_path_post_install_admin, "PUT", jsonData, null))
      .then((response) => {
        createAdminCallBackHandler(response);
      })
      .catch((error) => {
        props.setErrorMessage(error);
        props.setError(true);
      });
  }

  return (
    <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
      <Typography variant="h5" gutterBottom color="primary">
        {
          i18next.t(
            "create_administrator",
            "Create administrator account"
          ) as string
        }
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label={i18next.t("username", "Username") as string}
            name="username"
            autoComplete="email"
            autoFocus
            {...formik.getFieldProps("username")}
          />
          {formik.touched.username && formik.errors.username ? (
            <span>{formik.errors.username}</span>
          ) : null}
        </Grid>
        <Grid item xs={6}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label={i18next.t("password", "Password") as string}
            type="password"
            id="password"
            autoComplete="current-password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <span>{formik.errors.password}</span>
          ) : null}
        </Grid>

        <Grid item xs={6}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label={i18next.t("confirm_password", "Confirm password") as string}
            type="password"
            id="confirmPassword"
            autoComplete="current-password"
            {...formik.getFieldProps("confirmPassword")}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <span>{formik.errors.confirmPassword}</span>
          ) : null}
        </Grid>
      </Grid>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        {i18next.t("continue", "Continue") as string}
      </Button>
    </form>
  );
}
