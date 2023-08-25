import Users from "views/Users/Users";

import ListLayout from "layouts/ListLayout";

export default function UsersRoute() {
  return <ListLayout component={<Users />} />;
}
