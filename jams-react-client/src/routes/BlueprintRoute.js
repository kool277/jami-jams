import React from "react";

import BaseLayout from "layouts/BaseLayout.js";
import Blueprint from "views/Blueprint/Blueprint";

export default function UsersRoute (props) {
    return (
        <BaseLayout component={<Blueprint blueprintName={props.match.params.blueprintname} />} />
    )
}