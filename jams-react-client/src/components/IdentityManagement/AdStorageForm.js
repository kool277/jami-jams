import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import CustomPopupState from '../CustomPopupState/CustomPopupState'

export default function AdStorageForm(props) {

    return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom color="primary">Active directory server informations</Typography>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="port"
                        label="Port"
                        name="port"
                        autoComplete="port"
                        autoFocus
                        onChange={e => props.setPort(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="host"
                        label="Host"
                        name="host"
                        autoComplete="host"
                        autoFocus
                        onChange={e => props.setHost(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="adminusername"
                        label="Admin username"
                        name="adminusername"
                        autoComplete="adminusername"
                        autoFocus
                        onChange={e => props.setAdminUsername(e.target.value)}
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
                        name="password"
                        autoComplete="password"
                        type="password"
                        autoFocus
                        onChange={e => props.setPassword(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="domainname"
                        label="Domain Name"
                        name="domainname"
                        autoComplete="domainname"
                        autoFocus
                        onChange={e => props.setDomainName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom color="primary">Use SSL</Typography>
                    <RadioGroup row aria-label="isSSL" name="isSSL" value={props.isSSL} onChange={props.handleIsSSLChange} >
                        <FormControlLabel value="true" control={<Radio color="primary"/>} label="Yes" />
                        <FormControlLabel value="false" control={<Radio color="default"/>} label="No" />
                    </RadioGroup>
                </Grid>
            </Grid>
    );
}