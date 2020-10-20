import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import i18next from 'i18next';

export default function AdStorageForm(props) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom color="primary">
        {i18next.t("active_directory_server_informations", "Active Directory server information")}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="port"
          label={i18next.t("port", "Port")}
          name="port"
          autoComplete="port"
          value={props.values.port}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          helperText={
            props.errors.port && props.touched.port && props.errors.port
          }
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="host"
          label={i18next.t("host", "Host")}
          name="host"
          autoComplete="host"
          value={props.values.host}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          helperText={
            props.errors.host && props.touched.host && props.errors.host
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
          label={i18next.t("admin_username", "Admin username")}
          name="adadminusername"
          autoComplete="adminusername"
          value={props.values.adadminusername}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          helperText={
            props.errors.adadminusername &&
            props.touched.adadminusername &&
            props.errors.adadminusername
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
          name="adpassword"
          autoComplete="password"
          type="password"
          value={props.values.adpassword}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          helperText={
            props.errors.adpassword &&
            props.touched.adpassword &&
            props.errors.adpassword
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="domainname"
          label={i18next.t("domain_name", "Domain Name")}
          name="domainname"
          autoComplete="domainname"
          value={props.values.domainname}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          helperText={
            props.errors.domainname &&
            props.touched.domainname &&
            props.errors.domainname
          }
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom color="primary">
          Use SSL
        </Typography>
        <RadioGroup
          row
          aria-label="isSSL"
          name="isSSL"
          value={props.isSSL}
          onChange={props.handleIsSSLChange}
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
    </Grid>
  );
}
