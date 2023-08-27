import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

import i18next from "i18next";

export default function AdStorageForm(props) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom color="primary">
          {
            i18next.t(
              "active_directory_server_informations",
              "Active Directory server information"
            ) as string
          }
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="port"
          label={i18next.t("port", "Port") as string}
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
          label={i18next.t("host", "Host") as string}
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
          label={i18next.t("admin_username", "Admin username") as string}
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
          label={i18next.t("password", "Password") as string}
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
          label={i18next.t("domain_name", "Domain Name") as string}
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
            label={i18next.t("yes", "Yes") as string}
          />
          <FormControlLabel
            value="false"
            control={<Radio color="default" />}
            label={i18next.t("no", "No") as string}
          />
        </RadioGroup>
      </Grid>
    </Grid>
  );
}
