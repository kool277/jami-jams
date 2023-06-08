import React from "react";

import ListLayout from "layouts/ListLayout.js";
import Groups from "views/Groups/Groups.js";

export default function GroupsRoute() {
  return <ListLayout component={<Groups />} />;
}
