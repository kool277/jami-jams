import React, { useState } from "react";

import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import EditBlueprintPermissions from "./EditBlueprintPermissions";
import EditBlueprintConfiguration from "./EditBlueprintConfiguration";
import EditBlueprintUi from "./EditBlueprintUi";
import { PolicyDataContextProvider } from "./PolicyDataContext";

import { infoColor } from "assets/jss/material-dashboard-react.js";

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

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

export default function Blueprint({ blueprintName }) {
  const [openedTab, setOpenedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setOpenedTab(newValue);
  };

  return (
    <div>
      <AppBar position="static" style={{ background: infoColor[0] }}>
        <Tabs
          value={openedTab}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab
            label={i18next.t("permissions", "Permissions")}
            {...a11yProps(0)}
          />
          <Tab
            label={i18next.t("configuration", "Configuration")}
            {...a11yProps(1)}
          />
          <Tab
            label={i18next.t("customization", "Customization")}
            {...a11yProps(2)}
          />
        </Tabs>
      </AppBar>

      <PolicyDataContextProvider blueprintName={blueprintName}>
        <TabPanel value={openedTab} index={0}>
          <EditBlueprintPermissions blueprintName={blueprintName} />
        </TabPanel>
        <TabPanel value={openedTab} index={1}>
          <EditBlueprintConfiguration blueprintName={blueprintName} />
        </TabPanel>
        <TabPanel value={openedTab} index={2}>
          <EditBlueprintUi blueprintName={blueprintName} />
        </TabPanel>
      </PolicyDataContextProvider>
    </div>
  );
}
