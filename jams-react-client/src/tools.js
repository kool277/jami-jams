import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';

function buildSelectMenuItems(elements) {
    return elements.map((d) =>
        <MenuItem value={d.value}>{d.label}</MenuItem>
    )
}


export default buildSelectMenuItems;