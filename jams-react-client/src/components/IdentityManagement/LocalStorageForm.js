import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CustomPopupState from '../CustomPopupState/CustomPopupState'

import i18next from 'i18next';

export default function LocalStorageForm(props) {
    
    return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom color="primary">{i18next.t("advanced_settings", "Advanced settings")}</Typography>
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
                    label={i18next.t("use_public_nameserver", "Use public nameserver")}
                    />
                    <CustomPopupState message={i18next.t("check_box_register_usernames_on_jami_public_nameserver", "Check this box if you want to register your usernames on Jami's public nameserver.")}/>
                </Grid>
            </Grid>
    );
}