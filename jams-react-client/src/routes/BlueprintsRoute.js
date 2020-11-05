import React from "react";

import Blueprints from "views/Blueprints/Blueprints.js";

import ListLayout from "layouts/ListLayout.js";

export default function UsersRoute () {
    return (
        <ListLayout component={<Blueprints />} />
    )
}