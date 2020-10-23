import React from 'react';
import InfoIcon from '@material-ui/icons/Info';
import Popover from '@material-ui/core/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';


export default function CustomPopupState(props) {

    return(
<IconButton>

<PopupState variant="popover" popupId="demo-popup-popover">
    {(popupState) => (
        <div>
        <InfoIcon color="primary" fontSize="small" {...bindTrigger(popupState)} />
        <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
            }}
            transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
            }}
        >
            <Box p={1}>
        <Typography>{props.message}</Typography>
            </Box>
        </Popover>
        </div>
    )}
</PopupState>
</IconButton>
    );
}