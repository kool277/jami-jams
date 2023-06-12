import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// core components
import Devices from "components/Devices/Devices.js";

import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import EditCreateUserProfile from "./EditCreateUserProfile";

import Contacts from "views/Contacts/Contacts";

import { infoColor } from "assets/jss/material-dashboard-react.js";
import DisplayUserProfile from "./DisplayUserProfile";

import i18next from "i18next";

import auth from "auth.js";

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

export default function UserProfile(props) {
  const history = useHistory();

  const [value, setValue] = useState(0);
  const [displayUser, setDisplayUser] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (props.username === "null") {
      history.push("/");
    }
  }, []);

  return (
    <div>
      <AppBar position="static" style={{ background: infoColor[0] }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label={i18next.t("profile", "Profile")} {...a11yProps(0)} />
          <Tab label={i18next.t("devices", "Devices")} {...a11yProps(1)} />
          <Tab label={i18next.t("contacts", "Contacts")} {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {displayUser ? (
          <DisplayUserProfile
            username={props.username}
            setDisplayUser={setDisplayUser}
          />
        ) : (
          <EditCreateUserProfile
            username={props.username}
            createUser={false}
            setDisplayUser={setDisplayUser}
          />
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Devices username={props.username} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Contacts username={props.username} setValue={setValue} />
      </TabPanel>
    </div>
  );
}
