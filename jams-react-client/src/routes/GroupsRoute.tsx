import React from "react";

import ListLayout from "layouts/ListLayout";
import Groups from "views/Groups/Groups";

export default function GroupsRoute() {
  return <ListLayout component={<Groups />} />;
}
