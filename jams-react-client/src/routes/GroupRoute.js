import React from "react";

import ListLayout from "layouts/ListLayout.js";
import EditGroup from "views/Groups/EditGroup.js";

export default function GroupRoute(props) {
  return (
    <ListLayout
      component={<EditGroup groupid={props.match.params.groupid} />}
    />
  );
}
