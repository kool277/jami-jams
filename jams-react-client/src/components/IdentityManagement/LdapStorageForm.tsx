import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import CustomPopupState from "../CustomPopupState/CustomPopupState";

import i18next from "i18next";

export default function LdapStorageForm(props) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom color="primary">
          {i18next.t("ldap_server_information", "LDAP Server informations")}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="servername"
          label={i18next.t("server_address", "Server address")}
          name="servername"
          autoComplete="servername"
          value={props.values.servername}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          helperText={
            props.errors.servername &&
            props.touched.servername &&
            props.errors.servername
          }
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="adminusername"
          label={i18next.t("administrator_username", "Administrator username")}
          name="ldapadminusername"
          autoComplete="adminusername"
          value={props.values.ldapadminusername}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          helperText={
            props.errors.ldapadminusername &&
            props.touched.ldapadminusername &&
            props.errors.ldapadminusername
          }
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="password"
          label={i18next.t("password", "Password")}
          name="ldappassword"
          autoComplete="password"
          type="password"
          value={props.values.ldappassword}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          helperText={
            props.errors.ldappassword &&
            props.touched.ldappassword &&
            props.errors.ldappassword
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          id="basedn"
          label={i18next.t(
            "base_dn_please_use_ldap_convention",
            "Base DN (Please use LDAP convention)"
          )}
          name="basedn"
          autoComplete="basedn"
          required
          fullWidth
          value={props.values.basedn}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          helperText={
            props.errors.basedn && props.touched.basedn && props.errors.basedn
          }
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom color="primary">
          Use Start TLS
        </Typography>
        <RadioGroup
          row
          aria-label="useStartTLS"
          name="useStartTLS"
          value={props.useStartTLS}
          onChange={props.handleUseStartTLSChange}
        >
          <FormControlLabel
            value="true"
            control={<Radio color="primary" />}
            label={i18next.t("yes", "Yes")}
          />
          <FormControlLabel
            value="false"
            control={<Radio color="default" />}
            label={i18next.t("no", "No")}
          />
        </RadioGroup>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom color="primary">
          Filter
          <CustomPopupState
            message={i18next.t(
              "field_ldap_structure_contains_username",
              "This is the field in your LDAP structure which contains the username."
            )}
          />
        </Typography>
        <Select
          labelId="filter-ldap-select"
          fullWidth
          value={props.ldapFilter.value}
          onChange={props.handleFilterIdChange}
          variant="outlined"
        >
          {props.ldapFiltersTypesItems}
        </Select>
      </Grid>
    </Grid>
  );
}
