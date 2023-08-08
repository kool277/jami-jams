import React from "react";

import ListLayout from "layouts/ListLayout";
import EditGroup from "views/Groups/EditGroup";

export default function GroupRoute(props) {
  return (
    <ListLayout
      component={<EditGroup groupid={props.match.params.groupid} />}
    />
  );
}
