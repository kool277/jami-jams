import React from "react";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Field } from "formik";

import CustomPopupState from "../CustomPopupState/CustomPopupState";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";

import * as tool from "../../tools";

import axios from "axios";
import configApiCall from "../../api";
import { api_path_post_install_server } from "../../globalUrls";
import auth from "auth";
import * as Yup from "yup";

import i18next from 'i18next';

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

export default function ServerParameters(props) {
  // Formik validation fields
  const initialValues = { domain: window.location.origin };
  const validationSchema = Yup.object().shape({
    domain: Yup.string().required(i18next.t("domain_is_required", "Domain is required.")),
  });

  const certificateRevocationTypes = [
    { value: 300000, label: i18next.t("5_minutes", "5 minutes") },
    { value: 600000, label: i18next.t("10_minutes", "10 minutes") },
    { value: 900000, label: i18next.t("15_minutes", "15 minutes") },
    { value: 1800000, label: i18next.t("30_minutes", "30 minutes") },
    { value: 3600000, label: i18next.t("60_minutes", "60 minutes") },
  ];

  const deviceLifetimeTypes = [
    { value: 2629746000, label: i18next.t("1_month", "1 month") },
    { value: 7889238000, label: i18next.t("3_months", "3 months") },
    { value: 15778476000, label: i18next.t("6_months", "6 months") },
    { value: 31556952000, label: i18next.t("1_year", "1 year") },
    { value: 157784760000, label: i18next.t("5_years", "5 years") },
  ];

  const userAccountLifetimeTypes = [
    { value: 31556952000, label: i18next.t("1_year", "1 year") },
    { value: 157784760000, label: i18next.t("5_years", "5 years") },
    { value: 315569520000, label: i18next.t("10_years", "10 years") },
  ];

  const certificateRevocationTypesItems = tool.buildSelectMenuItems(
    certificateRevocationTypes
  );
  const deviceLifetimeTypesItems = tool.buildSelectMenuItems(
    deviceLifetimeTypes
  );
  const userAccountLifetimeTypesItems = tool.buildSelectMenuItems(
    userAccountLifetimeTypes
  );

  const classes = useStyles();
  const history = useHistory();
  const [certificateRevocation, setCertificateRevocation] = React.useState(
    certificateRevocationTypes[0]
  );
  const [deviceLifetime, setDeviceLifetime] = React.useState(
    deviceLifetimeTypes[3]
  );
  const [userAccountLifetime, setUserAccountLifetime] = React.useState(
    userAccountLifetimeTypes[0]
  );
  const [sipConfigurationTemplate, setSIPCertificateTemplate] = React.useState(
    null
  );
  const [userlifeDisabled, setUserlifeDisabled] = React.useState(false);

  React.useEffect(() => {
    if (deviceLifetime.value <= userAccountLifetime.value) {
      setUserlifeDisabled(false);
    } else {
      setUserlifeDisabled(true);
    }
  }, [deviceLifetime, userAccountLifetime]);

  function callBackServerParameters() {
    auth.installed = true;
    auth.authenticated = true;
    auth.admin = true;
    auth.checkDirectoryType(() => {
      history.push("/admin/users");
    });
  }

  function handleSubmit(values) {
    let jsonData = {};
    let re = new RegExp(/^http[s]?:\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*$/);
    if (values.domain.match(re)) {
      jsonData = {
        serverDomain: values.domain,
        crlLifetime: certificateRevocation.value,
        deviceLifetime: deviceLifetime.value,
        userLifetime: userAccountLifetime.value,
        sipConfig: sipConfigurationTemplate,
        signingAlgorithm: "SHA512WITHRSA",
      };
      axios(configApiCall(api_path_post_install_server, "POST", jsonData, null))
        .then((response) => {
          callBackServerParameters();
        })
        .catch((error) => {
          console.log("Error installing server parameters: " + error);
        });
    } else {
      props.setError(true);
      props.setErrorMessage(i18next.t("please_enter_valid_cors_domain_url", "Please enter a valid CORS domain URL."));
    }
    // Check https://www.geeksforgeeks.org/file-uploading-in-react-js/ for the file upload
  }

  const handleCertificateRevocationChange = (event) => {
    setCertificateRevocation(
      tool.retrieveArrayElement(event.target.value, certificateRevocationTypes)
    );
  };

  const handleDeviceLifetimeChange = (event) => {
    setDeviceLifetime(
      tool.retrieveArrayElement(event.target.value, deviceLifetimeTypes)
    );
  };

  const handleUserAccountLifetimeChange = (event) => {
    setUserAccountLifetime(
      tool.retrieveArrayElement(event.target.value, userAccountLifetimeTypes)
    );
  };

  const handleSipConfigurationTemplateChange = (event) => {
    setSIPCertificateTemplate(event.target.files[0]);
  };

  return (
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
            <Typography variant="h5" gutterBottom color="primary">
            {i18next.t("server_parameters", "Server Parameters")}
            </Typography>
            <Typography variant="body1" gutterBottom>
            {i18next.t("global_parameters_cover_general_configuration_of_servers_engine", "The global parameters cover the general configuration of the server's engine.")}  
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
            {i18next.t("cors_domain_name", "CORS domain name")}
              <CustomPopupState message={i18next.t("set_domain_of_web_cleint_server_to_connect_to_hans_admin_dashboard_and_jami_accounts_also_to_set_client_crls_ocsps", "Set the domain of the web client server to connect to the JAMS admin dashboard and Jami accounts. It is also used to define where the clients should download CRLs and submit OCSP queries. In case you are running a proxied instance (i.e. JAMS behind IIS), please make sure to set this field correctly, otherwise devices will not be able to download CRLs or validate certificates.")} />
            </Typography>
            <Typography variant="body1" gutterBottom>
            {i18next.t("domain_name_of_web_client_server", "The domain name of your web client server. Requires http:// or https://")}
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="domain"
              label={i18next.t("domain", "Domain")}
              name="domain"
              autoComplete="domain"
              autoFocus
              value={values.domain}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={errors.domain && touched.domain && errors.domain}
            />
            <Typography variant="subtitle1" gutterBottom>
            {i18next.t("certificate_revocation_list_lifetime", "Certificate Revocation List Lifetime")}
              <CustomPopupState message={i18next.t("set_liftetime_crl_list_certificates_revoked", "Set the lifetime of the CRL which contains the list of the certificates that have been revoked before their scheduled expiration date.")} />
            </Typography>
            <Select
              labelId="certificate-revocation-select-label"
              fullWidth
              value={certificateRevocation.value}
              onChange={handleCertificateRevocationChange}
              variant="outlined"
              children={certificateRevocationTypesItems}
            />
            <Typography variant="subtitle1" gutterBottom>
              {i18next.t("device_lifetime", "Device lifetime")}
            </Typography>
            <Select
              labelId="device-lifetime-select-label"
              fullWidth
              value={deviceLifetime.value}
              onChange={handleDeviceLifetimeChange}
              variant="outlined"
              children={deviceLifetimeTypesItems}
            />
            <Typography variant="subtitle1" gutterBottom>
              {i18next.t("user_account_lifetime", "User account lifetime")}
            </Typography>
            <Select
              labelId="user-account-lifetime-select-label"
              fullWidth
              value={userAccountLifetime.value}
              onChange={handleUserAccountLifetimeChange}
              isDisabled={userlifeDisabled}
              variant="outlined"
              children={userAccountLifetimeTypesItems}
            />
            {userlifeDisabled ? (
              <span class="spanError">
                {i18next.t("account_lifetime_should_be_bigger_to_device_lifetime", "The account lifetime should be longer than the Device lifetime.")}
              </span>
            ) : null}
            <Typography variant="subtitle1" gutterBottom>
              {i18next.t("sip_configuration_template", "SIP Configuration Template")}
            </Typography>
            <Input
              fullWidth
              type="file"
              onChange={handleSipConfigurationTemplateChange}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {i18next.t("set_server_parameters", "Set Server Parameters")}
            </Button>
          </form>
        );
      }}
    </Formik>
  );
}
