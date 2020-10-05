import React from "react";
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
import Snackbar from "@material-ui/core/Snackbar";

import routes from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/logo-jams.svg";

import auth from "auth";
import configApiCall from "api.js";
import {
  api_path_get_start_update,
  api_path_get_subscription_status,
} from "globalUrls";

import axios from "axios";

import ReactDOM from "react-dom";
import { ConfiguredRoute } from "../configured.route";
import SignIn from "./SignIn";
import { ProtectedRoute } from "../protected.route";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import { Field, Formik } from "formik";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import TextField from "@material-ui/core/TextField/TextField";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import Button from "@material-ui/core/Button";

let ps;

const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
      return null;
    })}
    <Redirect from="/users" to="/admin/users" />
    <Redirect from="/admin/u" to="/admin/users" />
    <Redirect from="/admin/g" to="/admin/groups" />
    <Redirect from="/admin/b" to="/admin/blueprints" />
    <Redirect from="/admin/s" to="/admin/settings" />
  </Switch>
);

const useStyles = makeStyles(styles);

export default function Admin({ ...rest }) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [image, setImage] = React.useState(bgImage);
  const [color, setColor] = React.useState("blue");
  const [fixedClasses, setFixedClasses] = React.useState("dropdown");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState(false);
  const [signedUp, setSignedUp] = React.useState(false);
  const [signedIn, setSignedIn] = React.useState(false);
  const [token, setToken] = React.useState(false);
  const [severity, setSeverity] = React.useState("success");
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [dialogMessage, setDialogMessage] = React.useState("");
  const [messageYes, setMessageYes] = React.useState("");
  const [messageNo, setMessageNo] = React.useState("");
  const [updating, setUpdating] = React.useState(false);
  const [query, setQuery] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const handleImageClick = (image) => {
    setImage(image);
  };
  const handleColorClick = (color) => {
    setColor(color);
  };
  const handleFixedClick = () => {
    if (fixedClasses === "dropdown") {
      setFixedClasses("dropdown show");
    } else {
      setFixedClasses("dropdown");
    }
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/admin/maps";
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
                "A new version of JAMS is available. Would you like to update now?"
            );
            setMessageYes("Update Now");
            setMessageNo("Update Later");
        } else {
            setDialogMessage(
                "You are currently running the community version of JAMS. Would you like to purchase a JAMS subscription?"
            );
            setMessageYes("Yes, go to Jami Store");
            setMessageNo("No thanks");
        }
    } else
        setDialogMessage("You are not allowed to access this section. Please contact your administrator to get administrator privileges.");

  };

  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    auth.checkForUpdates(() => {
      auth.getUpdates(() => {
        if (auth.isUpdateAvailable()) {
          setOpen(true);
          setMessage("An update is available for JAMS.");
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
      setSnackbarMessage("Updating JAMS, shutting down shortly...");
      axios(configApiCall(api_path_get_start_update, "POST", null, null))
        .then(() => {
          handleCancel();
          setUpdating(true);
        })
        .catch((error) => {
          setSnackbarMessage("Error while attempting to update JAMS: " + error);
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
              else window.location.href = "https://staging.jami.biz/";
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
        routes={routes}
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
        {...rest}
      />

      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          routes={routes}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes}</div>
          </div>
        ) : (
          <div className={classes.map}>{switchRoutes}</div>
        )}
        {getRoute() ? <Footer /> : null}
        {/* <FixedPlugin
          handleImageClick={handleImageClick}
          handleColorClick={handleColorClick}
          bgColor={color}
          bgImage={image}
          handleFixedClick={handleFixedClick}
          fixedClasses={fixedClasses}
        /> */}
      </div>
    </div>
  );
}
