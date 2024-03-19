import EditCreateUserProfile from "views/UserProfile/EditCreateUserProfile";

import ListLayout from "layouts/ListLayout";

export default function CreateUserRoute() {
  return <ListLayout component={<EditCreateUserProfile createUser={true} />} />;
}
