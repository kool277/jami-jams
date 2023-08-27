import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";

import CountrySelect from "components/CountrySelect/CountrySelect";

import auth from "../../auth";
import axios from "axios";
import configApiCall from "../../api";
import { api_path_post_install_ca } from "../../globalUrls";
import Select from "@mui/material/Select";
import * as tool from "../../tools";
import Input from "@mui/material/Input";
import Typography from "@mui/material/Typography";

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

export default function CaSetup(props) {
  const history = useHistory();

  /**
   * Formik Validation Fields
   */

  const initialValuesform1 = {
    commonname: "",
    state: "",
    city: "",
    organization: "",
    organizationunit: "",
    country: "",
  };

  const initialValuesform2 = { certificatefile: "", privkeyfile: "" };

  const validationSchemaform1 = Yup.object().shape({
    commonname: Yup.string().required(
      i18next.t("common_name_is_required", "Common name is required.") as string
    ),
    state: Yup.string().required(
      i18next.t("state_is_required", "State is required.") as string
    ),
    city: Yup.string().required(
      i18next.t("city_is_required", "City is required.") as string
    ),
    organization: Yup.string().required(
      i18next.t(
        "organization_is_required",
        "Organization is required."
      ) as string
    ),
    organizationunit: Yup.string().required(
      i18next.t(
        "organization_unit_is_required",
        "Organization unit is required."
      )
    ),
    country: Yup.string().required(
      i18next.t("country_is_required", "Country is required.") as string
    ),
  });

  const validationSchemaform2 = Yup.object().shape({
    certificatefile: Yup.mixed().required(
      i18next.t(
        "certificate_file_is_required",
        "Certificate file is required."
      ) as string
    ),
    privkeyfile: Yup.mixed().required(
      i18next.t(
        "private_key_file_is_required",
        "Private key file is required."
      ) as string
    ),
  });

  const getCertificateOptions = [
    {
      value: 0,
      label: i18next.t(
        "create_self_signed_certificate_authority",
        "Create a self-signed Certificate Authority"
      ),
    },
    {
      value: 1,
      label: i18next.t(
        "import_existing_certificate_authority",
        "Import existing Certificate Authority"
      ),
    },
  ];

  const validityPeriods = [
    { value: 157784630000, label: i18next.t("5_years", "5 years") as string },
    { value: 315569260000, label: i18next.t("10_years", "10 years") as string },
  ];

  const certificateOptionsItems = tool.buildSelectMenuItems(
    getCertificateOptions
  );
  const validityPeriodsItems = tool.buildSelectMenuItems(validityPeriods);
  const classes = useStyles();

  const [certificateOpt, setCertificateOpt] = useState(
    getCertificateOptions[0]
  );
  const [validityPeriod, setValidityPeriod] = useState(validityPeriods[0]);

  function handleInstallCA(data) {
    if (data.status === 500 || data.status === 512 || data.status === 513) {
      props.setError(true);
      props.setErrorMessage(
        i18next.t(
          "unknown_error_occured_while_installing_the_ca",
          "An unknown error occurred while installing the CA. Please try again."
        )
      );
    } else if (data.status === 200) {
      auth.uri = "/api/install/auth";
      history.push("/");
    }
  }

  const handleCertifOptionChange = (event) => {
    props.setError(false);
    setCertificateOpt(getCertificateOptions[event.target.value]);
  };

  const handleValidPeriodChange = (event) => {
    props.setError(false);
    setValidityPeriod(
      tool.retrieveArrayElement(event.target.value, validityPeriods)
    );
  };

  const handleSubmit = (values) => {
    let jsonData = {};
    if (certificateOpt.value === 0) {
      jsonData = {
        fields: {
          commonName: values.commonname,
          organizationalUnit: values.organizationUnit,
          organization: values.organization,
          city: values.city,
          state: values.state,
          country: values.country,
          lifetime: validityPeriod.value,
        },
      };
    } else if (certificateOpt.value === 1) {
      jsonData = {
        caCertificate: values.certificatefile,
        caKey: values.privkeyfile,
      };
    }

    axios(configApiCall(api_path_post_install_ca, "POST", jsonData, null))
      .then((response) => {
        handleInstallCA(response);
      })
      .catch((error) => {
        props.setError(error);
        console.log("Error installing CA Setup: " + error);
      });
  };
  if (certificateOpt.value === 0) {
    return (
      <Formik
        validationSchema={validationSchemaform1}
        initialValues={initialValuesform1}
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
              <h4>
                {
                  i18next.t(
                    "ca_setup_header",
                    "Select an option for setting-up the certificate authority that will be used to sign all Jami accounts generated on this JAMS instance."
                  ) as string
                }
              </h4>
              <Select
                labelId="certificate-option-select-label"
                fullWidth
                value={certificateOpt.value}
                onChange={handleCertifOptionChange}
                variant="outlined"
              >
                {certificateOptionsItems}
              </Select>

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="commonname"
                label={i18next.t("common_name", "Common Name") as string}
                name="commonname"
                autoComplete="commonname"
                autoFocus
                value={values.commonname}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  errors.commonname && touched.commonname && errors.commonname
                }
              />

              <CountrySelect defaultValue={values.country} {...props} />
              {touched.country && errors.country ? (
                <span className="spanError">{errors.country}</span>
              ) : null}

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="state"
                label={i18next.t("state", "State") as string}
                id="state"
                autoComplete="state"
                value={values.state}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errors.state && touched.state && errors.state}
              />

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="city"
                label={i18next.t("cistatety", "City") as string}
                id="city"
                autoComplete="city"
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errors.city && touched.city && errors.city}
              />

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="organization"
                label={i18next.t("organization", "Organization") as string}
                id="organization"
                autoComplete="organization"
                value={values.organization}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  errors.organization &&
                  touched.organization &&
                  errors.organization
                }
              />

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="organizationunit"
                label={
                  i18next.t("organization_unit", "Organization Unit") as string
                }
                id="organizationunit"
                autoComplete="organizationunit"
                value={values.organizationunit}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  errors.organizationunit &&
                  touched.organizationunit &&
                  errors.organizationunit
                }
              />

              <Select
                labelId="validity-period-select-label"
                fullWidth
                variant="outlined"
                value={validityPeriod.value}
                onChange={handleValidPeriodChange}
              >
                {validityPeriodsItems}
              </Select>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {
                  i18next.t(
                    "generate_self_signed_certificate_authority",
                    "Generate Self-Signed Certificate Authority"
                  ) as string
                }
              </Button>
            </form>
          );
        }}
      </Formik>
    );
  } else if (certificateOpt.value === 1) {
    return (
      <Formik
        validationSchema={validationSchemaform2}
        initialValues={initialValuesform2}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        {(props) => {
          const { handleSubmit, handleChange } = props;
          return (
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <h4>
                {
                  i18next.t(
                    "select_option_setting_up_certificate_authority",
                    "Select an option for setting-up the certificate authority that will be used to sign all Jami accounts generated on this JAMS instance."
                  ) as string
                }
              </h4>

              <Select
                labelId="demo-simple-select-label"
                fullWidth
                value={certificateOpt.value}
                onChange={handleCertifOptionChange}
                variant="outlined"
              >
                {certificateOptionsItems}
              </Select>
              <Typography variant="subtitle1" gutterBottom>
                CA file (PEM-encoded)
              </Typography>
              <Field name="certificatefile">
                {({ field, form }) => (
                  <div>
                    <Input
                      fullWidth
                      type="file"
                      onChange={handleChange}
                      {...field}
                    />
                    {form.errors.certificatefile &&
                    form.touched.certificatefile ? (
                      <span className="spanError">
                        {form.errors.certificatefile}
                      </span>
                    ) : null}
                  </div>
                )}
              </Field>
              <Typography variant="subtitle1" gutterBottom>
                Key File (PEM-encoded)
              </Typography>
              <Field name="privkeyfile">
                {({ field, meta }) => (
                  <div>
                    <Input fullWidth type="file" {...field} />
                    {meta.touched && meta.error && (
                      <span className="spanError">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {
                  i18next.t(
                    "import_certificate_authority",
                    "Import Certificate Authority"
                  ) as string
                }
              </Button>
            </form>
          );
        }}
      </Formik>
    );
  }
}
