import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";

// @material-ui/icons
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Person from "@material-ui/icons/Person";
import Group from "@material-ui/icons/Group";
import AllInbox from "@material-ui/icons/AllInbox";
import SettingsIcon from "@material-ui/icons/Settings";
// core components/views for Admin layout
import Users from "views/Users/Users.js";
import Groups from "views/Groups/Groups.js";
import Blueprints from "views/Blueprints/Blueprints.js";
import Settings from "views/Settings/Settings.js";
// core components/views for RTL layout

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/jams_logo_white_no_gnu_package.svg";

import auth from "auth";
import configApiCall from "api.js";
import { api_path_get_start_update } from "globalUrls";

import axios from "axios";

import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import Button from "@material-ui/core/Button";

import i18next from "i18next";

let ps;

const useStyles = makeStyles(styles);

export default function Admin(props) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [image, setImage] = useState(bgImage);
  const [color, setColor] = useState("blue");
  const [fixedClasses, setFixedClasses] = useState("dropdown");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [messageYes, setMessageYes] = useState("");
  const [messageNo, setMessageNo] = useState("");
  const [updating, setUpdating] = useState(false);
  const [query, setQuery] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const Routes = [
    {
      path: `/user/${auth.getUsername()}`,
      name: i18next.t("myprofile", "My profile"),
      icon: AccountCircleIcon,
      component: Users,
      layout: "/admin",
      admin: false,
    },
    {
      path: "/users",
      name: i18next.t("users", "Users"),
      icon: Person,
      component: Users,
      layout: "/admin",
      admin: false,
    },
    {
      path: "/groups",
      name: i18next.t("groups", "Groups"),
      icon: Group,
      component: Groups,
      layout: "/admin",
      admin: true,
    },
    {
      path: "/blueprints",
      name: i18next.t("blueprints", "Blueprints"),
      icon: AllInbox,
      component: Blueprints,
      layout: "/admin",
      admin: true,
    },
    {
      path: "/settings",
      name: i18next.t("settings", "Settings"),
      icon: SettingsIcon,
      component: Settings,
      layout: "/admin",
      admin: true,
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  const handleQuery = () => {
    setQuery(true);
    if (auth.hasAdminScope()) {
      if (auth.isActivated()) {
        setDialogMessage(
          i18next.t(
            "new_version_jams_available",
            "A new version of JAMS is available. Would you like to update now?"
          )
        );
        setMessageYes("Update Now");
        setMessageNo("Update Later");
      } else {
        setDialogMessage(
          i18next.t(
            "running_community_version_jams",
            "You are currently running the community version of JAMS. Would you like to purchase a JAMS subscription?"
          )
        );
        setMessageYes("Yes, go to Jami Store");
        setMessageNo("No thanks");
      }
    } else {
      setDialogMessage(
        i18next.t(
          "you_are_not_allowed_to_access_this_section",
          "You are not allowed to access this section. Please contact your administrator to get administrator privileges."
        )
      );
    }
  };

  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    auth.checkForUpdates(() => {
      auth.getUpdates(() => {
        if (auth.isUpdateAvailable()) {
          setOpen(true);
          setMessage(
            i18next.t(
              "an_update_is_available_for_jams",
              "An update is available for JAMS."
            )
          );
        }
      });
    });

    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [openUpdate, mainPanel]);

  const handleCancel = () => {
    setOpenUpdate(false);
  };

  const handleUpdate = () => {
    setQuery(false);
    if (auth.isActivated()) {
      setSnackbarMessage(
        i18next.t(
          "updating_jams_shutting_down_shortly",
          "Updating JAMS, shutting down shortly..."
        )
      );
      axios(configApiCall(api_path_get_start_update, "POST", null, null))
        .then(() => {
          handleCancel();
          setUpdating(true);
        })
        .catch((error) => {
          setSnackbarMessage(
            i18next.t(
              "error_while_attempting_update_jams",
              "Error occurred while attempting to update JAMS:"
            ) + error
          );
        });
    }
  };

  return (
    <div className={classes.wrapper}>
      <Dialog
        open={openUpdate}
        onClose={handleCancel}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-revoke-dialog-title">Jams Update</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              if (auth.isActivated()) handleUpdate();
              else window.location.href = "https://jami.biz/";
            }}
            color="primary"
          >
            {messageYes}
          </Button>
          <Button onClick={handleCancel} color="primary">
            {messageNo}
          </Button>
        </DialogActions>
      </Dialog>
      <Sidebar
        routes={Routes}
        logoText={"Jams"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        handleQuery={handleQuery}
        updating={updating}
        snackbarMessage={snackbarMessage}
        setOpenUpdate={setOpenUpdate}
      />

      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar routes={Routes} handleDrawerToggle={handleDrawerToggle} />
        <div className={classes.content}>
          <div className={classes.container}>{props.component}</div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
