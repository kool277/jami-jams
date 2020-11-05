import React from "react";

import EditCreateUserProfile from "views/UserProfile/EditCreateUserProfile.js";

import ListLayout from "layouts/ListLayout.js";

export default function CreateUserRoute () {
    return (
        <ListLayout component={<EditCreateUserProfile createUser={true} />} />
    )
}

//     <EditCreateUserProfile
  //       createUser={createUser}
  //       setCreateUser={setCreateUser}
  //       setError={props.setError}
  //       setErrorMessage={props.setErrorMessage}
  //       setSeverity={props.setSeverity}
  //     />