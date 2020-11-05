import React from "react";

import Users from "views/Users/Users.js";

import ListLayout from "layouts/ListLayout.js";

export default function UsersRoute () {
    return (
        <ListLayout component={<Users />} />
    )
}