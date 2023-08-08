import React from "react";
import { Route } from "react-router-dom";
import auth from "./auth";
import SignUp from "layouts/SignUp";
import SignIn from "layouts/SignIn";

export const ConfiguredRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (auth.hasAdmin()) {
          if (auth.isInstalled()) {
            return <Component {...props} />;
          } else if (!auth.isInstalled() && auth.isAuthenticated()) {
            if (auth.uri === "/api/install/ca" || auth.uri === "start") {
              return <SignUp step={1} />;
            } else if (auth.uri === "/api/install/auth") {
              return <SignUp step={2} />;
            } else if (auth.uri === "/api/install/settings") {
              return <SignUp step={3} />;
            } else {
              console.log("Error no matching path for configuration");
            }
          } else {
            return <SignIn />;
          }
        } else {
          return <SignUp step={0} />;
        }
      }}
    />
  );
};
