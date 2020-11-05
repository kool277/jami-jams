import React from "react";

import Groups from "views/Groups/Groups.js";

import ListLayout from "layouts/ListLayout.js";

export default function UsersRoute () {
    return (
        <ListLayout component={<Groups />} />
    )
}