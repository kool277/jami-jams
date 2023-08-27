import { createRef, useEffect, useState } from "react";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @mui/material components
import { makeStyles } from "@mui/styles";
// core components
import Navbar from "components/Navbars/Navbar";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";

// @mui/icons-material
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Person from "@mui/icons-material/Person";
import Group from "@mui/icons-material/Group";
import AllInbox from "@mui/icons-material/AllInbox";
import SettingsIcon from "@mui/icons-material/Settings";
// core components/views for Admin layout
import Users from "views/Users/Users";
import Groups from "views/Groups/Groups";
import Blueprints from "views/Blueprints/Blueprints";
import Settings from "views/Settings/Settings";
// core components/views for RTL layout

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle";

import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/jams_logo_white_no_gnu_package.svg";

import auth from "auth";
import configApiCall from "api";
import { api_path_get_start_update } from "globalUrls";

import axios from "axios";

import Dialog from "@mui/material/Dialog/Dialog";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import DialogActions from "@mui/material/DialogActions/DialogActions";
import DialogContentText from "@mui/material/DialogContentText/DialogContentText";
import Button from "@mui/material/Button";

import i18next from "i18next";

let ps;

const useStyles = makeStyles(styles as any);

export default function Admin(props) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = createRef();
  // states and functions
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
      name: i18next.t("myprofile", "My profile") as string,
      icon: AccountCircleIcon,
      component: Users,
      layout: "/admin",
      admin: false,
    },
    {
      path: "/users",
      name: i18next.t("users", "Users") as string,
      icon: Person,
      component: Users,
      layout: "/admin",
      admin: false,
    },
    {
      path: "/groups",
      name: i18next.t("groups", "Groups") as string,
      icon: Group,
      component: Groups,
      layout: "/admin",
      admin: true,
    },
    {
      path: "/blueprints",
      name: i18next.t("blueprints", "Blueprints") as string,
      icon: AllInbox,
      component: Blueprints,
      layout: "/admin",
      admin: true,
    },
    {
      path: "/settings",
      name: i18next.t("settings", "Settings") as string,
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
  useEffect(() => {
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
            onClick={() => {
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
        image={bgImage}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color="blue"
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
