import { useState } from "react";
// core components
import General from "./General";
import Subscription from "./Subscription";

import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import MuiAlert from "@mui/material/Alert";

import auth from "auth";

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
          <Typography component="div">{children}</Typography>
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

function a11yProps(value, index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
    style: { color: index === value ? "inherit" : "#ffffff80" },
  };
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Settings() {
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
          {
            i18next.t(
              "you_are_not_allowed_to_access_this_section",
              "You are not allowed to access this section. Please contact your administrator to get administrator privileges."
            ) as string
          }
        </h4>
      </div>
    );
  } else {
    return (
      <div>
        <AppBar position="static" color="primary">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="settings tabs"
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab
              label={i18next.t("general", "General") as string}
              {...a11yProps(value, 0)}
            />
            <Tab
              label={i18next.t("subscription", "Subscription") as string}
              {...a11yProps(value, 1)}
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
