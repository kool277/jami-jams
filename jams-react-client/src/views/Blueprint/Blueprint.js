import React from "react";

import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import EditBlueprintPermissions from "./EditBlueprintPermissions"
import EditBlueprintConfiguration from "./EditBlueprintConfiguration"

import {
  infoColor
} from "assets/jss/material-dashboard-react.js";

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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

export default function Blueprint(props) {

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <AppBar position="static" style={{ background: infoColor[0] }}>
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" style={{ margin: "0.7rem"}}>
          <Tab label={i18next.t("permissions", "Permissions")} {...a11yProps(0)} />
          <Tab label={i18next.t("configuration", "Configuration")} {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
            <EditBlueprintPermissions blueprintName={props.blueprintName} />
      </TabPanel>
      <TabPanel value={value} index={1}>
            <EditBlueprintConfiguration blueprintName={props.blueprintName} />
      </TabPanel>
    </div>
  );
}
