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
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import Group from "@material-ui/icons/Group";
import AllInbox from "@material-ui/icons/AllInbox"
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import Users from "views/Users/Users.js";
import Groups from "views/Groups/Groups.js";
import Blueprints from "views/Blueprints/Blueprints.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import TableList from "views/TableList/TableList.js";
import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import Maps from "views/Maps/Maps.js";
import NotificationsPage from "views/Notifications/Notifications.js";
import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.js";
// core components/views for RTL layout
import RTLPage from "views/RTLPage/RTLPage.js";

const dashboardRoutes = [
  {
    path: "/users",
    name: "Users",
    rtlName: "المستخدمون",
    icon: Person,
    component: Users,
    layout: "/admin"
  },
  {
    path: "/groups",
    name: "Groups",
    rtlName: "مجموعات",
    icon: Group,
    component: Groups,
    layout: "/admin"
  },
  {
    path: "/blueprints",
    name: "Blueprints",
    rtlName: "المخططات",
    icon: AllInbox,
    component: Blueprints,
    layout: "/admin"
  },
];

export default dashboardRoutes;
