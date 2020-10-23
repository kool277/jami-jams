import React from "react";
import clsx from "clsx";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import DnsOutlinedIcon from "@material-ui/icons/DnsOutlined";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import VpnKeyOutlinedIcon from "@material-ui/icons/VpnKeyOutlined";
import LanguageOutlinedIcon from "@material-ui/icons/LanguageOutlined";

import { hexToRgb, blackColor } from "assets/jss/material-dashboard-react.js";

import BuildOutlinedIcon from "@material-ui/icons/BuildOutlined";

import axios from "axios";
import configApiCall from "../../api";
import { api_path_blueprints } from "../../globalUrls";

import Snackbar from "@material-ui/core/Snackbar";

import MuiAlert from "@material-ui/lab/Alert";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

import Switch from "@material-ui/core/Switch";
import CustomPopupState from "../../components/CustomPopupState/CustomPopupState";

import i18next from "i18next";

const styles = (theme) => ({
  ...dashboardStyle,
  root: {
    flexGrow: 1,
  },
  radioRoot: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  icon: {
    borderRadius: "50%",
    width: 16,
    height: 16,
    boxShadow:
      "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
    backgroundColor: "#f5f8fa",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    "$root.Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: "#ebf1f5",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)",
    },
  },
  checkedIcon: {
    backgroundColor: "#137cbd",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    "&:before": {
      display: "block",
      width: 16,
      height: 16,
      backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor: "#106ba3",
    },
  },
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
  input: {
    display: "none",
  },
  profileAsBackground: {
    backgroundSize: "100% 100%",
    width: "80px",
    height: "80px",
  },
  centerIconMiddle: {
    position: "relative",
    top: "20px",
    left: "15px",
  },
  editProfilePicture: {
    borderRadius: "50%",
    width: "200px",
    height: "200px",
    boxShadow:
      "0 6px 8px -12px rgba(" +
      hexToRgb(blackColor) +
      ", 0.56), 0 4px 25px 0px rgba(" +
      hexToRgb(blackColor) +
      ", 0.12), 0 8px 10px -5px rgba(" +
      hexToRgb(blackColor) +
      ", 0.2)",
  },
  dialogPaper: {
    minHeight: "60vh",
    maxHeight: "60vh",
    minWidth: "80vh",
    maxWidth: "80vh",
  },
});

const useStyles = makeStyles(styles);

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

// Inspired by blueprintjs
const StyledRadio = (props) => {
  const classes = useStyles();

  return (
    <Radio
      className={classes.radioRoot}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
};

export default function EditBlueprintConfiguration(props) {
  const classes = useStyles();

  const [videoEnabled, setVideoEnabled] = React.useState(true);
  const [publicInCalls, setPublicInCalls] = React.useState(true);
  const [autoAnswer, setAutoAnswer] = React.useState(false);
  const [peerDiscovery, setPeerDiscovery] = React.useState(true);
  const [rendezVous, setRendezVous] = React.useState(false);

  const [selectedTurnOption, setSelectedTurnOption] = React.useState(
    "defaultTurn"
  );
  const [selectedDHTProxyOption, setSelectedDHTProxyOption] = React.useState(
    "defaultDHTProxy"
  );
  const [upnpEnabled, setUpnpEnabled] = React.useState(true);
  const [turnEnabled, setTurnEnabled] = React.useState(true);
  const [turnServer, setTurnServer] = React.useState("turn.jami.net");
  const [turnServerUserName, setTurnServerUserName] = React.useState("ring");
  const [turnServerPassword, setTurnServerPassword] = React.useState("ring");
  const [proxyEnabled, setProxyEnabled] = React.useState(false);
  const [proxyServer, setProxyServer] = React.useState("dhtproxy.jami.net");
  const [dhtProxyListUrl, setDhtProxyListUrl] = React.useState("");

  const [turnPassowrdVisible, setTurnPasswordVisible] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState(false);
  const [severity, setSeverity] = React.useState("success");

  React.useEffect(() => {
    axios(
      configApiCall(
        api_path_blueprints + "?name=" + props.blueprintName,
        "GET",
        null,
        null
      )
    )
      .then((response) => {
        let policyData = JSON.parse(response.data.policyData);
        setVideoEnabled(policyData["videoEnabled"]);
        setPublicInCalls(policyData["publicInCalls"]);
        setAutoAnswer(policyData["autoAnswer"]);
        setPeerDiscovery(policyData["peerDiscovery"]);
        setRendezVous(policyData["rendezVous"]);

        setUpnpEnabled(policyData["upnpEnabled"]);
        if (policyData["turnEnabled"] === true) {
          setSelectedTurnOption("customTurn");
          setTurnEnabled(policyData["turnEnabled"]);
          setTurnServer(policyData["turnServer"]);
          setTurnServerUserName(policyData["turnServerUserName"]);
          setTurnServerPassword(policyData["turnServerPassword"]);
        } else if (policyData["turnEnabled"] === false) {
          setSelectedTurnOption("disabledTurn");
          setTurnEnabled(false);
        } else {
          setSelectedTurnOption("defaultTurn");
        }
        if (policyData["proxyEnabled"] === true) {
          setSelectedDHTProxyOption("customDHTProxy");
          setProxyEnabled(policyData["proxyEnabled"]);
          setProxyServer(policyData["proxyServer"]);
          setDhtProxyListUrl(policyData["dhtProxyListUrl"]);
        } else if (policyData["proxyEnabled"] === false) {
          setSelectedDHTProxyOption("disabledDHTProxy");
          setTurnEnabled(false);
        } else {
          setSelectedDHTProxyOption("defaultDHTProxy");
        }
      })
      .catch((error) => {
        console.log(
          "Error fetching blueprint permissions : " +
            props.username +
            " " +
            error
        );
      });
  }, [props.blueprintName, props.username]);

  const handleUpdateConfiguration = (field, value, selectedOptions = []) => {
    let data = {
      videoEnabled: videoEnabled,
      publicInCalls: publicInCalls,
      autoAnswer: autoAnswer,
      peerDiscovery: peerDiscovery,
      accountDiscovery: peerDiscovery,
      accountPublish: peerDiscovery,
      rendezVous: rendezVous,
      upnpEnabled: upnpEnabled,
      turnEnabled: turnEnabled,
      turnServer: turnServer,
      turnServerUserName: turnServerUserName,
      turnServerPassword: turnServerPassword,
      proxyEnabled: proxyEnabled,
      proxyServer: proxyServer,
      dhtProxyListUrl: dhtProxyListUrl,
    };

    data[field] = value;

    selectedOptions.forEach((selectedOption) => {
      if (selectedOption === "defaultTurn") {
        delete data.turnEnabled;
        delete data.turnServer;
        delete data.turnServerUserName;
        delete data.turnServerPassword;
      }

      if (selectedOption === "defaultDHTProxy") {
        delete data.proxyEnabled;
        delete data.proxyServer;
        delete data.dhtProxyListUrl;
      }

      if (selectedOption === "customTurn") {
        data.turnEnabled = true;
      }
      if (selectedOption === "customDHTProxy") {
        data.proxyEnabled = true;
      }

      if (selectedOption === "disabledTurn") {
        data.turnEnabled = false;
      }
      if (selectedOption === "disabledDHTProxy") {
        data.proxyEnabled = false;
      }
    });

    axios(
      configApiCall(
        api_path_blueprints + "?name=" + props.blueprintName,
        "PUT",
        data,
        null
      )
    )
      .then((response) => {
        setOpen(false);
        setSeverity("success");
        setOpen(true);
        setMessage(i18next.t("updated_blueprint_configuration_successfully", "Blueprint configuration successfully updated."));
      })
      .catch((error) => {
        setOpen(false);
        setSeverity("error");
        setOpen(true);
        setMessage(i18next.t("error_updating_blueprint_configuration", "Error occurred while updating blueprint configuration.") + error + "!");
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTurnChangedOption = (event) => {
    setSelectedTurnOption(event.target.value);
    if (event.target.value === "customTurn") {
      setTurnEnabled(true);
      handleUpdateConfiguration("turnEnabled", true, [
        event.target.value,
        selectedDHTProxyOption,
      ]);
    } else {
      setTurnEnabled(false);
      handleUpdateConfiguration("turnEnabled", false, [
        event.target.value,
        selectedDHTProxyOption,
      ]);
    }
  };

  const handleDHTProxyChangedOption = (event) => {
    setSelectedDHTProxyOption(event.target.value);
    if (event.target.value === "customDHTProxy") {
      setProxyEnabled(true);
      handleUpdateConfiguration("proxyEnabled", true, [
        selectedTurnOption,
        event.target.value,
      ]);
    } else {
      setProxyEnabled(false);
      handleUpdateConfiguration("proxyEnabled", false, [
        selectedTurnOption,
        event.target.value,
      ]);
    }
  };

  const handleMouseDownPassword = () => {
    setTurnPasswordVisible(true);
  };

  const handleMouseUpPassword = () => {
    setTurnPasswordVisible(false);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        onClose={handleClose}
        message={message}
        key={"bottomright"}
      >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card profile>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <BuildOutlinedIcon />
              </CardIcon>
              <p className={classes.cardCategory}>{i18next.t("configuration", "Configuration")}</p>
              <h3 className={classes.cardTitle}>{props.blueprintName}</h3>
            </CardHeader>
            <CardBody profile>
              <div className={classes.root}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12}>
                    <FormLabel component="legend">UPnP <CustomPopupState message="UPnP allows networked devices to seamlessly discover each other's presence on the network and establish communications." /></FormLabel>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={upnpEnabled}
                          color="primary"
                          onChange={(e) => {
                            setUpnpEnabled(e.target.checked);
                            handleUpdateConfiguration(
                              "upnpEnabled",
                              e.target.checked,
                              [selectedTurnOption, selectedDHTProxyOption]
                            );
                          }}
                          name="upnpEnabled"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                      }
                      label={i18next.t("enable_upnp", "Enable UPnP")}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">TURN <CustomPopupState message="TURN is a protocol that assists your devices in traversing NATs (Network address translators) or firewalls." /></FormLabel>
                      <RadioGroup
                        value={selectedTurnOption}
                        aria-label="gender"
                        name="customized-radios"
                        onChange={handleTurnChangedOption}
                      >
                        <FormControlLabel
                          value="defaultTurn"
                          control={<StyledRadio />}
                          label={i18next.t("use_jami_default_turn_configuration", "Use Jami default TURN configuration")}
                        />
                        <FormControlLabel
                          value="customTurn"
                          control={<StyledRadio />}
                          label={i18next.t("use_a_custom_turn_configuration", "Use a custom TURN configuration")}
                        />
                        <FormGroup
                          row
                          style={{
                            display:
                              selectedTurnOption === "customTurn"
                                ? "block"
                                : "none",
                          }}
                        >
                          <FormControl className={classes.margin} size="large">
                            <InputLabel htmlFor="turnServer">
                            {i18next.t("turn_server_address", "TURN Server address")}
                            </InputLabel>
                            <Input
                              id="turnServer"
                              placeholder={turnServer}
                              startAdornment={
                                <InputAdornment position="start">
                                  <DnsOutlinedIcon />
                                </InputAdornment>
                              }
                              onChange={(e) => {
                                setTurnServer(e.target.value);
                                handleUpdateConfiguration(
                                  "turnServer",
                                  e.target.value,
                                  ["customTurn", selectedDHTProxyOption]
                                );
                              }}
                            />
                          </FormControl>
                        </FormGroup>
                        <FormGroup
                          row
                          style={{
                            display:
                              selectedTurnOption === "customTurn"
                                ? "block"
                                : "none",
                          }}
                        >
                          <FormControl className={classes.margin} size="large">
                            <InputLabel htmlFor="turnServerUserName">
                              {i18next.t("turn_server_username", "TURN server username")}
                            </InputLabel>
                            <Input
                              id="turnServerUserName"
                              placeholder={turnServerUserName}
                              startAdornment={
                                <InputAdornment position="start">
                                  <AccountCircleIcon />
                                </InputAdornment>
                              }
                              onChange={(e) => {
                                setTurnServerUserName(e.target.value);
                                handleUpdateConfiguration(
                                  "turnServerUserName",
                                  e.target.value,
                                  ["customTurn", selectedDHTProxyOption]
                                );
                              }}
                            />
                          </FormControl>
                        </FormGroup>
                        <FormGroup
                          row
                          style={{
                            display:
                              selectedTurnOption === "customTurn"
                                ? "block"
                                : "none",
                          }}
                        >
                          <FormControl className={classes.margin} size="large">
                            <InputLabel htmlFor="turnServerPassword">
                            {i18next.t("turn_server_password", "TURN server password")}
                            </InputLabel>
                            <Input
                              disabled={!turnEnabled}
                              id="turnServerPassword"
                              placeholder="****"
                              type={turnPassowrdVisible ? "text" : "password"}
                              startAdornment={
                                <InputAdornment position="start">
                                  <VpnKeyOutlinedIcon />
                                </InputAdornment>
                              }
                              endAdornment={
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onMouseDown={handleMouseDownPassword}
                                  onMouseUp={handleMouseUpPassword}
                                >
                                  {turnPassowrdVisible ? (
                                    <VisibilityIcon />
                                  ) : (
                                    <VisibilityOffIcon />
                                  )}
                                </IconButton>
                              }
                              onChange={(e) => {
                                setTurnServerPassword(e.target.value);
                                handleUpdateConfiguration(
                                  "turnServerPassword",
                                  e.target.value,
                                  ["customTurn", selectedDHTProxyOption]
                                );
                              }}
                            />
                          </FormControl>
                        </FormGroup>
                        <FormControlLabel
                          value="disabledTurn"
                          control={<StyledRadio />}
                          label={i18next.t("disable_turn_configuration", "Disable TURN configuration")}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4}></Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">DHT Proxy <CustomPopupState message="Configure custom settings for a given Distributed Hash Table (DHT) proxy server." /></FormLabel>
                      <RadioGroup
                        value={selectedDHTProxyOption}
                        aria-label="gender"
                        name="customized-radios"
                        onChange={handleDHTProxyChangedOption}
                      >
                        <FormControlLabel
                          value="defaultDHTProxy"
                          control={<StyledRadio />}
                          label={i18next.t("use_jami_default_dht_proxy_configuration", "Use Jami default DHT Proxy configuration")}
                        />
                        <FormControlLabel
                          value="customDHTProxy"
                          control={<StyledRadio />}
                          label={i18next.t("use_a_custom_dht_proxy_configuration", "Use a custom DHT Proxy configuration")}
                        />
                        <FormGroup row>
                          <FormControl
                            className={classes.margin}
                            size="large"
                            style={{
                              display:
                                selectedDHTProxyOption === "customDHTProxy"
                                  ? "block"
                                  : "none",
                            }}
                          >
                            <InputLabel htmlFor="proxyServer">
                            {i18next.t("dht_proxy_server_name", "DHT proxy server name")}
                            </InputLabel>
                            <Input
                              id="proxyServer"
                              placeholder={proxyServer}
                              startAdornment={
                                <InputAdornment position="start">
                                  <LanguageOutlinedIcon />
                                </InputAdornment>
                              }
                              onChange={(e) => {
                                setProxyServer(e.target.value);
                                handleUpdateConfiguration(
                                  "proxyServer",
                                  e.target.value,
                                  [selectedTurnOption, "customDHTProxy"]
                                );
                              }}
                            />
                          </FormControl>
                        </FormGroup>
                        <FormGroup row>
                          <FormControl
                            className={classes.margin}
                            size="large"
                            style={{
                              display:
                                selectedDHTProxyOption === "customDHTProxy"
                                  ? "block"
                                  : "none",
                            }}
                          >
                            <InputLabel htmlFor="dhtProxyListUrl">
                              {i18next.t("dht_proxy_list_url", "DHT proxy List URL")}
                            </InputLabel>
                            <Input
                              id="proxyServer"
                              placeholder={dhtProxyListUrl}
                              startAdornment={
                                <InputAdornment position="start">
                                  <LanguageOutlinedIcon />
                                </InputAdornment>
                              }
                              onChange={(e) => {
                                setDhtProxyListUrl(e.target.value);
                                handleUpdateConfiguration(
                                  "dhtProxyListUrl",
                                  e.target.value,
                                  [selectedTurnOption, "customDHTProxy"]
                                );
                              }}
                            />
                          </FormControl>
                        </FormGroup>
                        <FormControlLabel
                          value="disabledDHTProxy"
                          control={<StyledRadio />}
                          label={i18next.t("disable_dht_proxy_configuration", "Disable DHT Proxy configuration")}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4}></Grid>
                </Grid>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
