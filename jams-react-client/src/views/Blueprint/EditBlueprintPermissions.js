import React from "react";
import { useHistory } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
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

import Snackbar from "@material-ui/core/Snackbar";

import { hexToRgb, blackColor } from "assets/jss/material-dashboard-react.js";

import PriorityHighOutlinedIcon from "@material-ui/icons/PriorityHighOutlined";

import axios from "axios";
import configApiCall from "../../api";
import { api_path_blueprints } from "../../globalUrls";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

import MuiAlert from "@material-ui/lab/Alert";

const styles = (theme) => ({
  ...dashboardStyle,
  root: {
    flexGrow: 1,
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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function EditBlueprintPermissions(props) {
  const classes = useStyles();
  const history = useHistory();

  const [videoEnabled, setVideoEnabled] = React.useState(true);
  const [allowCertFromContact, setAllowCertFromContact] = React.useState(true);
  const [autoAnswer, setAutoAnswer] = React.useState(false);
  const [peerDiscovery, setPeerDiscovery] = React.useState(true);
  const [rendezVous, setRendezVous] = React.useState(false);

  const [upnpEnabled, setUpnpEnabled] = React.useState(true);
  const [turnEnabled, setTurnEnabled] = React.useState(true);
  const [turnServer, setTurnServer] = React.useState("turn.jami.net");
  const [turnServerUserName, setTurnServerUserName] = React.useState("ring");
  const [turnServerPassword, setTurnServerPassword] = React.useState("ring");
  const [proxyEnabled, setProxyEnabled] = React.useState(false);
  const [proxyServer, setProxyServer] = React.useState("dhtproxy.jami.net");
  const [dhtProxyListUrl, setDhtProxyListUrl] = React.useState("");

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
        setAllowCertFromContact(policyData["allowCertFromContact"]);
        setAutoAnswer(policyData["autoAnswer"]);
        setPeerDiscovery(policyData["peerDiscovery"]);
        setRendezVous(policyData["rendezVous"]);

        setUpnpEnabled(policyData["upnpEnabled"]);
        setTurnEnabled(policyData["turnEnabled"]);
        setTurnServer(policyData["turnServer"]);
        setTurnServerUserName(policyData["turnServerUserName"]);
        setTurnServerPassword(policyData["turnServerPassword"]);
        setProxyEnabled(policyData["proxyEnabled"]);
        setProxyServer(policyData["proxyServer"]);
        setDhtProxyListUrl(policyData["dhtProxyListUrl"]);
      })
      .catch((error) => {
        console.log(
          "Error fetching blueprint permissions : " +
            props.blueprintName +
            " " +
            error
        );
      });
  }, []);

  const handleUpdatePermissions = (field, value) => {
    let data = {
      videoEnabled: videoEnabled,
      allowCertFromContact: allowCertFromContact,
      allowCertFromHistory: allowCertFromContact,
      allowCertFromTrusted: allowCertFromContact,
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

    if (field === "allowCertFromContact") {
      data.allowCertFromContact = value;
      data.allowCertFromHistory = value;
      data.allowCertFromTrusted = value;
    } else if (field === "peerDiscovery") {
      data.peerDiscovery = value;
      data.accountDiscovery = value;
      data.accountPublish = value;
    } else {
      data[field] = value;
    }

    if (turnEnabled == undefined) {
      delete data.turnEnabled;
      delete data.turnServer;
      delete data.turnServerUserName;
      delete data.turnServerPassword;
    }

    if (proxyEnabled == undefined) {
      delete data.proxyEnabled;
      delete data.proxyServer;
      delete data.dhtProxyListUrl;
    }

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
        setMessage("Updated blueprint permissions successfully !");
      })
      .catch((error) => {
        setOpen(false);
        setSeverity("error");
        setOpen(true);
        setMessage("Error updating blueprint permissions " + error + "!");
      });
  };

  const handleClose = () => {
    setOpen(false);
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
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <PriorityHighOutlinedIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Permissions</p>
              <h3 className={classes.cardTitle}>{props.blueprintName}</h3>
            </CardHeader>
            <CardBody profile>
              <div className={classes.root}>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={12} md={6}>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={videoEnabled}
                            color="primary"
                            onChange={(e) => {
                              setVideoEnabled(e.target.checked);
                              handleUpdatePermissions(
                                "videoEnabled",
                                e.target.checked
                              );
                            }}
                            name="videoEnabled"
                          />
                        }
                        label="Allow videos calls"
                      />
                    </FormGroup>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={allowCertFromContact}
                            color="primary"
                            onChange={(e) => {
                              setAllowCertFromContact(e.target.checked);
                              handleUpdatePermissions(
                                "allowCertFromContact",
                                e.target.checked
                              );
                            }}
                            name="allowCertFromContact"
                          />
                        }
                        label="Allow incomming calls from unknown contacts"
                      />
                    </FormGroup>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={autoAnswer}
                            color="primary"
                            onChange={(e) => {
                              setAutoAnswer(e.target.checked);
                              handleUpdatePermissions(
                                "autoAnswer",
                                e.target.checked
                              );
                            }}
                            name="autoAnswer"
                          />
                        }
                        label="Auto answer calls"
                      />
                    </FormGroup>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={peerDiscovery}
                            color="primary"
                            onChange={(e) => {
                              setPeerDiscovery(e.target.checked);
                              handleUpdatePermissions(
                                "peerDiscovery",
                                e.target.checked
                              );
                            }}
                            name="peerDiscovery"
                          />
                        }
                        label="Allow use of Jami in a local lan"
                      />
                    </FormGroup>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={rendezVous}
                            color="primary"
                            onChange={(e) => {
                              setRendezVous(e.target.checked);
                              handleUpdatePermissions(
                                "rendezVous",
                                e.target.checked
                              );
                            }}
                            name="rendezVous"
                          />
                        }
                        label="Rendezvous point: turn your account into a meeting point"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
