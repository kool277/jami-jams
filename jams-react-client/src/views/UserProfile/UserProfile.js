import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Devices from "components/Devices/Devices.js";
import Search from "@material-ui/icons/Search";

import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import noProfilePicture from "assets/img/faces/no-profile-picture.png";

import EditCreateUserProfile from "./EditCreateUserProfile"

import {
  infoColor
} from "assets/jss/material-dashboard-react.js";
import DisplayUserProfile from "./DisplayUserProfile";


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

const useStyles = makeStyles(styles);

export default function UserProfile(props) {
  const classes = useStyles();

  const [value, setValue] = React.useState(0);
  const [username, setUsername] = React.useState(props.username);
  const [displayUser, setDisplayUser] = React.useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <AppBar position="static" style={{ background: infoColor[0] }}>
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Profile" {...a11yProps(0)} />
          <Tab label="Devices" {...a11yProps(1)} />
          <Tab label="Contacts" {...a11yProps(2)} />
          <Tab label="Permissions" {...a11yProps(3)} />
          <Tab label="Configuration" {...a11yProps(4)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
          {displayUser? <DisplayUserProfile username={username} setDisplayUser={setDisplayUser}/>: <EditCreateUserProfile username={username} createUser={false} setDisplayUser={setDisplayUser}/>
          }

      </TabPanel>
      <TabPanel value={value} index={1}>
        <Devices username={props.username}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div className={classes.searchWrapper}>
          <CustomInput
            formControlProps={{
              className: classes.margin + " " + classes.search
            }}
            inputProps={{
              placeholder: "Search",
              inputProps: {
                "aria-label": "Search"
              }
            }}
          />
          <Button color="white" aria-label="edit" justIcon round>
            <Search />
          </Button>
        </div>
        <br></br>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <Card profile>
              <CardAvatar profile>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  <img src={noProfilePicture} alt="..." />
                </a>
              </CardAvatar>
              <CardBody profile>
                <h6 className={classes.cardCategory}>CEO</h6>
                <h4 className={classes.cardTitle}>Larbi Gharib</h4>
                <p className={classes.description}>
                  13 devices
                            </p>
                <Button color="success" round>
                  Add
              </Button>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card profile>
              <CardAvatar profile>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  <img src={noProfilePicture} alt="..." />
                </a>
              </CardAvatar>
              <CardBody profile>
                <h6 className={classes.cardCategory}>CEO</h6>
                <h4 className={classes.cardTitle}>Christophe Villemer</h4>
                <p className={classes.description}>
                  10 devices
                            </p>
                <Button color="danger" round>
                  Remove
              </Button>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Three
      </TabPanel>
    </div>
  );
}
