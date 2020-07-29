import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';

export function buildSelectMenuItems(elements) {
    return elements.map((d) =>
        <MenuItem value={d.value}>{d.label}</MenuItem>
    )
}

// read file content
export function readSingleFile(evt, fieldContents) {
    var f = evt.target.files[0];
    if (f) {
        var r = new FileReader();
        r.onload = function (e) {
            var contents = e.target.result;
            fieldContents=contents;
        }
        console.log(fieldContents);
        r.readAsText(f);
        return fieldContents
    }
}

export function retrieveArrayElement(value, elements){
    for(let i=0; i < elements.length;i++){
        if(elements[i].value === value){
            return elements[i];
        }
    }
}

export default {buildSelectMenuItems, readSingleFile, retrieveArrayElement};