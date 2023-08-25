import UserProfile from "views/UserProfile/UserProfile";

import BaseLayout from "layouts/BaseLayout";

export default function UsersRoute(props) {
  return (
    <BaseLayout
      component={<UserProfile username={props.match.params.username} />}
    />
  );
}
