import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import Select from "@mui/material/Select";

import { buildSelectMenuItems } from "../../tools";

import axios from "axios";
import configApiCall from "../../api";
import { api_path_post_install_auth } from "../../globalUrls";

import LocalStorageForm from "./LocalStorageForm";
import LdapForm from "./LdapStorageForm";
import AdStorageForm from "./AdStorageForm";

import auth from "../../auth";
import * as Yup from "yup";

import i18next from "i18next";

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

export default function IdentityManagement(props) {
  /**
   * Formik Validation Fields
   */

  const initialValuesLDAPform = {
    servername: "",
    ldapadminusername: "",
    ldappassword: "",
    basedn: "",
  };

  const initialValuesADform = {
    port: "",
    host: "",
    adadminusername: "",
    adpassword: "",
    domainname: "",
  };

  const validationSchemaLDAPform = Yup.object().shape({
    servername: Yup.string().required(
      i18next.t("servername_is_required", "Server name is required.")
    ),
    ldapadminusername: Yup.string().required(
      i18next.t("username_is_required", "Username is required!")
    ),
    ldappassword: Yup.string().required(
      i18next.t("password_is_required", "Password is required!")
    ),
    basedn: Yup.string().required(
      i18next.t("domain_name_is_required", "Domain name is required.")
    ),
  });

  const validationSchemaADform = Yup.object().shape({
    port: Yup.number()
      .typeError(i18next.t("port_must_be_a_number", "Port must be a number."))
      .positive(i18next.t("port_must_be_positive", "Port must be positive."))
      .integer(i18next.t("port_must_be_an_integer", "Port must be an integer."))
      .required(
        i18next.t("port_number_is_required", "Port number is required.")
      ),
    host: Yup.string().required(
      i18next.t("host_is_required", "Host is required.")
    ),
    adadminusername: Yup.string().required(
      i18next.t("username_is_required", "Username is required!")
    ),
    domainname: Yup.string().required(
      i18next.t("domain_name_is_required", "Domain name is required.")
    ),
    adpassword: Yup.string().required(
      i18next.t("password_is_required", "Password is required!")
    ),
  });

  const directoryTypes = [
    { value: 0, label: i18next.t("local_database", "Local Database") },
    { value: 1, label: i18next.t("ldap_server", "LDAP Server") },
    { value: 2, label: i18next.t("active_directory", "Active Directory") },
  ];

  const directoryTypesItems = buildSelectMenuItems(directoryTypes);

  const classes = useStyles();
  const history = useHistory();
  const [directory, setDirectory] = useState(directoryTypes[0]);

  /**
   * Local storage Config
   */

  const [nameServerChecked, setNameServerChecked] = useState(false);

  /**
   * LDAP storage Config
   *
   */
  const ldapFiltersTypes = [{ value: 0, label: "UID" }];

  const ldapFiltersTypesItems = buildSelectMenuItems(ldapFiltersTypes);
  const [useStartTLS, setUseStartTLS] = useState("false");
  const [ldapFilter, setLdapFilter] = useState(ldapFiltersTypes[0]);

  const handleFilterIdChange = (event) => {
    setLdapFilter(ldapFiltersTypes[event.target.value]);
  };
  const handleUseStartTLSChange = (event) => {
    setUseStartTLS(event.target.value);
  };

  const handleNameServerChange = (event) => {
    setNameServerChecked(event.target.checked);
  };

  /**
   * Active Directory Storage Config
   */

  const [isSSL, setIsSSL] = useState("false");

  const handleIsSSLChange = (event) => {
    setIsSSL(event.target.value);
  };

  /**
   * Form handle submit and server call
   */

  function setLocalStorageData() {
    const authSource = {};
    const settings = {
      publicNameServer: "http://ns.jami.net",
      publicNames: nameServerChecked,
    };

    authSource["type"] = "LOCAL";
    authSource["localAuthSettings"] = settings;
    return authSource;
  }

  function setLdapStorageData(values) {
    const authSource = {};
    const settings = {};

    settings["useStartTLS"] = useStartTLS === "true";
    settings["host"] = values.servername;
    settings["username"] = values.ldapadminusername;
    settings["password"] = values.ldappassword;
    settings["baseDN"] = values.basedn;
    settings["usernameField"] = ldapFilter.label;

    settings["fieldMappings"] = {};
    settings["fieldMappings"]["givenName"] = "FirstName";
    settings["fieldMappings"]["sn"] = "LastName";
    settings["fieldMappings"]["jpegPhoto"] = "ProfilePicture";
    settings["fieldMappings"]["mail"] = "Email";
    settings["fieldMappings"]["telephoneNumber"] = "PhoneNumber";
    settings["fieldMappings"]["mobile"] = "MobileNumber";
    settings["fieldMappings"]["facsimileTelephoneNumber"] = "FaxNumber";
    settings["fieldMappings"]["extensionName"] = "PhoneNumberExtension";
    settings["fieldMappings"]["o"] = "Organization";
    settings["fieldMappings"]["uid"] = "Username";

    authSource["type"] = "LDAP";
    authSource["ldapSettings"] = settings;
    return authSource;
  }

  function setAdStorageData(values) {
    const authSource = {};
    const settings = {};

    settings["isSSL"] = isSSL === "true";
    settings["host"] = values.host;
    settings["port"] = parseInt(values.port, 10);
    settings["realm"] = values.domainname;
    settings["username"] = values.adadminusername;
    settings["password"] = values.adpassword;

    settings["fieldMappings"] = {};
    settings["fieldMappings"]["sAMAccountName"] = "Username";
    settings["fieldMappings"]["givenName"] = "FirstName";
    settings["fieldMappings"]["sn"] = "LastName";
    settings["fieldMappings"]["jpegPhoto"] = "ProfilePicture";
    settings["fieldMappings"]["mail"] = "Email";
    settings["fieldMappings"]["telephoneNumber"] = "PhoneNumber";
    settings["fieldMappings"]["mobile"] = "MobileNumber";
    settings["fieldMappings"]["facsimileTelephoneNumber"] = "FaxNumber";
    settings["fieldMappings"]["extensionName"] = "PhoneNumberExtension";
    settings["fieldMappings"]["o"] = "Organization";
    settings["fieldMappings"]["uid"] = "Username";

    authSource["type"] = "AD";
    authSource["activeDirectorySettings"] = settings;
    return authSource;
  }

  function callbackIdentityManagement() {
    auth.uri = "/api/install/settings";
    history.push("/");
  }

  function handleSubmit(values) {
    let data = {};
    if (directory.value === 1) {
      data = setLdapStorageData(values);
    } else {
      data = setAdStorageData(values);
    }
    axios(configApiCall(api_path_post_install_auth, "POST", data, null))
      .then(() => {
        callbackIdentityManagement();
      })
      .catch(() => {
        props.setErrorMessage(
          i18next.t(
            "information_appears_incorrect_connection_directory_failed",
            "The information provided appears to be incorrect, the connection to the directory has failed. Please check the information and credentials provided and try again."
          )
        );
        props.setError(true);
      });
  }

  function handleLocalSubmit(e) {
    e.preventDefault();
    let data = {};
    data = setLocalStorageData();
    axios(configApiCall(api_path_post_install_auth, "POST", data, null))
      .then(() => {
        callbackIdentityManagement();
      })
      .catch(() => {
        props.setErrorMessage(
          i18next.t(
            "information_appears_incorrect_connection_directory_failed",
            "The information provided appears to be incorrect, the connection to the directory has failed. Please check the information and credentials provided and try again."
          )
        );
        props.setError(true);
      });
  }

  const handleChangeDirectoryType = (event) => {
    props.setError(false);
    setDirectory(directoryTypes[event.target.value]);
  };

  function returnForm(values, touched, errors, handleChange, handleBlur) {
    if (directory.value === 1) {
      return (
        <LdapForm
          useStartTLS={useStartTLS}
          handleUseStartTLSChange={handleUseStartTLSChange}
          ldapFilter={ldapFilter}
          ldapFiltersTypesItems={ldapFiltersTypesItems}
          handleFilterIdChange={handleFilterIdChange}
          values={values}
          touched={touched}
          errors={errors}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />
      );
    } else {
      return (
        <AdStorageForm
          isSSL={isSSL}
          handleIsSSLChange={handleIsSSLChange}
          values={values}
          touched={touched}
          errors={errors}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />
      );
    }
  }

  if (directory.value === 0) {
    return (
      <form className={classes.form} noValidate onSubmit={handleLocalSubmit}>
        <Typography variant="h5" gutterBottom color="primary">
          {i18next.t("identity_management", "Identity Management")}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              {i18next.t(
                "select_type_of_user_directory",
                "Select the type of user directory to be integrated with JAMS"
              )}
            </Typography>
            <Select
              labelId="demo-simple-select-label"
              fullWidth
              value={directory.value}
              onChange={handleChangeDirectoryType}
              variant="outlined"
            >
              {directoryTypesItems}
            </Select>
          </Grid>
        </Grid>
        <LocalStorageForm
          nameServerChecked={nameServerChecked}
          handleNameServerChange={handleNameServerChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          {i18next.t("set_identity_parameters", "Set identity parameters")}
        </Button>
      </form>
    );
  } else if (directory.value === 1) {
    return (
      <Formik
        validationSchema={validationSchemaLDAPform}
        initialValues={initialValuesLDAPform}
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
                {i18next.t("identity_management", "Identity Management")}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom>
                    {i18next.t(
                      "select_type_of_user_directory",
                      "Select the type of user directory to be integrated with JAMS"
                    )}
                  </Typography>
                  <Select
                    labelId="demo-simple-select-label"
                    fullWidth
                    value={directory.value}
                    onChange={handleChangeDirectoryType}
                    variant="outlined"
                  >
                    {directoryTypesItems}
                  </Select>
                </Grid>
              </Grid>
              {returnForm(values, touched, errors, handleChange, handleBlur)}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {i18next.t(
                  "set_identity_parameters",
                  "Set identity parameters"
                )}
              </Button>
            </form>
          );
        }}
      </Formik>
    );
  } else {
    return (
      <Formik
        validationSchema={validationSchemaADform}
        initialValues={initialValuesADform}
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
                {i18next.t("identity_management", "Identity Management")}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom>
                    {i18next.t(
                      "select_type_of_user_directory",
                      "Select the type of user directory to be integrated with JAMS"
                    )}
                  </Typography>
                  <Select
                    labelId="demo-simple-select-label"
                    fullWidth
                    value={directory.value}
                    onChange={handleChangeDirectoryType}
                    variant="outlined"
                  >
                    {directoryTypesItems}
                  </Select>
                </Grid>
              </Grid>
              {returnForm(values, touched, errors, handleChange, handleBlur)}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {i18next.t(
                  "set_identity_parameters",
                  "Set identity parameters"
                )}
              </Button>
            </form>
          );
        }}
      </Formik>
    );
  }
}
