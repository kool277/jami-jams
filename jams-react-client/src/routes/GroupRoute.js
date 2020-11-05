import React from "react";

import EditGroup from "views/Groups/EditGroup.js";

import BaseLayout from "layouts/BaseLayout.js";

export default function UsersRoute (props) {
    return (
        <BaseLayout component={<EditGroup groupName={props.match.params.groupname} />} />
    )
}