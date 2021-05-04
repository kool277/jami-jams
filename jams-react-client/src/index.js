/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { ProtectedRoute } from "protected.route";
import { ConfiguredRoute } from "configured.route";
import auth from "./auth";

// core components
import UsersRoute from "routes/UsersRoute.js";
import UserRoute from "routes/UserRoute.js";
import CreateUserRoute from "routes/CreateUserRoute.js";
import GroupsRoute from "routes/GroupsRoute.js";
import GroupRoute from "routes/GroupRoute.js";
import BlueprintsRoute from "routes/BlueprintsRoute.js";
import BlueprintRoute from "routes/BlueprintRoute.js";
import SettingsRoute from  "routes/SettingsRoute.js";

import SignIn from "layouts/SignIn.js";

import "assets/css/material-dashboard-react.css?v=1.9.0";

import "./i18n";

const hist = createBrowserHistory();
auth.checkServerInstalled(() => {
  auth.checkAdminAccountStatus(() => {
    auth.checkLastKnownStep(() => {
      ReactDOM.render(
        <Suspense fallback={<div>Loading...</div>}>
          <Router history={hist}>
            <Switch>
              <ConfiguredRoute path="/signin" component={SignIn} />
              <ProtectedRoute path="/users" component={UsersRoute} />
              <ProtectedRoute path="/user/:username" component={UserRoute} />
              <ProtectedRoute path="/createuser" component={CreateUserRoute} />
              <ProtectedRoute path="/groups" component={GroupsRoute} />
              <ProtectedRoute path="/group/:groupid" component={GroupRoute} />
              <ProtectedRoute path="/blueprints" component={BlueprintsRoute} />
              <ProtectedRoute path="/blueprint/:blueprintname" component={BlueprintRoute} />
              <ProtectedRoute path="/settings" component={SettingsRoute} />
              <Redirect from="/" to="/signin" />
            </Switch>
          </Router>
        </Suspense>,
        document.getElementById("root")
      );
    });
  });
});
