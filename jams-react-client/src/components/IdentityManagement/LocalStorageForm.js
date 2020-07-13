import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CustomPopupState from '../CustomPopupState/CustomPopupState'


export default function LocalStorageForm(props) {
    
    return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom color="primary">Advanced settings</Typography>
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                    control={
                        <Checkbox
                        checked={props.nameServerChecked}
                        onChange={props.handleNameServerChange}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        color="primary"
                        />
                    }
                    label="Use public nameserver"
                    />
                    <CustomPopupState message="Check this box if you want to register your usernames on Jami's public nameserver."/>
                </Grid>
            </Grid>
    );
}