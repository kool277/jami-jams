import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import CustomPopupState from '../CustomPopupState/CustomPopupState'

export default function LdapStorageForm(props) {

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom color="primary">LDAP Server informations</Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="servername"
                    label="Server Address"
                    name="servername"
                    autoComplete="servername"
                    value={props.values.servername}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    helperText={(props.errors.servername && props.touched.servername) && props.errors.servername}
                />
            </Grid>

            <Grid item xs={6}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="adminusername"
                    label="Administrator Username"
                    name="ldapadminusername"
                    autoComplete="adminusername"
                    value={props.values.ldapadminusername}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    helperText={(props.errors.ldapadminusername && props.touched.ldapadminusername) && props.errors.ldapadminusername}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    name="ldappassword"
                    autoComplete="password"
                    type="password"
                    value={props.values.ldappassword}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    helperText={(props.errors.ldappassword && props.touched.ldappassword) && props.errors.ldappassword}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    id="basedn"
                    label="Base DN (Please use LDAP convention)"
                    name="basedn"
                    autoComplete="basedn"
                    required
                    fullWidth
                    value={props.values.basedn}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    helperText={(props.errors.basedn && props.touched.basedn) && props.errors.basedn}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom color="primary">Use Start TLS</Typography>
                <RadioGroup row aria-label="useStartTLS" name="useStartTLS" value={props.useStartTLS} onChange={props.handleUseStartTLSChange} >
                    <FormControlLabel value="true" control={<Radio color="primary"/>} label="Yes" />
                    <FormControlLabel value="false" control={<Radio color="default"/>} label="No" />
                </RadioGroup>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom color="primary">Filter<CustomPopupState message="This is the field in your LDAP structure which contains the username."/></Typography>
                <Select
                    labelId="filter-ldap-select"
                    fullWidth
                    value={props.ldapFilter.value}
                    onChange={props.handleFilterIdChange}
                    variant="outlined"
                    children={props.ldapFiltersTypesItems}
                />
            </Grid>
        </Grid>
    );
}