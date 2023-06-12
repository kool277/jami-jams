import React, { useState } from "react";
// core components
import General from "./General";
import Subscription from "./Subscription";

import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import { infoColor } from "assets/jss/material-dashboard-react.js";
import MuiAlert from "@material-ui/lab/Alert";

import auth from "auth.js";

import i18next from "i18next";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

export default function Settings(props) {
  const [value, setValue] = useState(0);
  const [error, setError] = useState(false);
  const [severity, setSeverity] = useState("error");
  const [errorMessage, setErrorMessage] = useState("Test");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  if (!auth.hasAdminScope()) {
    return (
      <div>
        <h4>
          {i18next.t(
            "you_are_not_allowed_to_access_this_section",
            "You are not allowed to access this section. Please contact your administrator to get administrator privileges."
          )}
        </h4>
      </div>
    );
  } else {
    return (
      <div>
        <AppBar position="static" style={{ background: infoColor[0] }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label={i18next.t("general", "General")} {...a11yProps(0)} />
            <Tab
              label={i18next.t("subscription", "Subscription")}
              {...a11yProps(1)}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <General
            username="admin"
            setError={setError}
            setErrorMessage={setErrorMessage}
            setSeverity={setSeverity}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Subscription
            setError={setError}
            setErrorMessage={setErrorMessage}
            setSeverity={setSeverity}
          />
        </TabPanel>
        {error && errorMessage && (
          <Alert severity={severity}>{errorMessage}</Alert>
        )}
      </div>
    );
  }
}
