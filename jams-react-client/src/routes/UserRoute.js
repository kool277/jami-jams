import React from "react";

import UserProfile from "views/UserProfile/UserProfile.js";

import BaseLayout from "layouts/BaseLayout.js";

export default function UsersRoute(props) {
  return (
    <BaseLayout
      component={<UserProfile username={props.match.params.username} />}
    />
  );
}
