import EditCreateUserProfile from "views/UserProfile/EditCreateUserProfile";

import ListLayout from "layouts/ListLayout";

export default function CreateUserRoute() {
  return <ListLayout component={<EditCreateUserProfile createUser={true} />} />;
}

//     <EditCreateUserProfile
//       createUser={createUser}
//       setCreateUser={setCreateUser}
//       setError={props.setError}
//       setErrorMessage={props.setErrorMessage}
//       setSeverity={props.setSeverity}
//     />
