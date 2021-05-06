import React from "react";
import { Link, useHistory } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import classnames from "classnames";

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
import FormLabel from "@material-ui/core/FormLabel";
import Button from "components/CustomButtons/Button.js";

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import Avatar from "@material-ui/core/Avatar";

import Table from "@material-ui/core/Table";
import TableHead from '@material-ui/core/TableHead';
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";

import Snackbar from "@material-ui/core/Snackbar";

import { hexToRgb, blackColor } from "assets/jss/material-dashboard-react.js";

import PriorityHighOutlinedIcon from "@material-ui/icons/PriorityHighOutlined";

import noProfilePicture from "assets/img/faces/no-profile-picture.png";

import axios from "axios";
import configApiCall from "../../api";
import { 
  api_path_blueprints,
  api_path_get_user_directory_search,
  api_path_get_ns_name_from_addr,
  api_path_get_user_profile
} from "../../globalUrls";

import TemporaryDrawer from "components/Drawer/Drawer"

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

import MuiAlert from "@material-ui/lab/Alert";

import i18next from "i18next";

import auth from "auth.js";

import CustomPopupState from "../../components/CustomPopupState/CustomPopupState";

import Switch from "@material-ui/core/Switch";

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

  const tableCellClasses = classnames(classes.tableCell);

  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [blueprintModerators, setBlueprintModerators] = React.useState([]);

  const [videoEnabled, setVideoEnabled] = React.useState(true);
  const [publicInCalls, setPublicInCalls] = React.useState(true);
  const [autoAnswer, setAutoAnswer] = React.useState(false);
  const [peerDiscovery, setPeerDiscovery] = React.useState(true);
  const [rendezVous, setRendezVous] = React.useState(false);
  const [defaultModerators, setDefaultModerators] = React.useState("");

  const [upnpEnabled, setUpnpEnabled] = React.useState(true);
  const [turnEnabled, setTurnEnabled] = React.useState(true);
  const [turnServer, setTurnServer] = React.useState("turn.jami.net");
  const [turnServerUserName, setTurnServerUserName] = React.useState("ring");
  const [turnServerPassword, setTurnServerPassword] = React.useState("ring");
  const [proxyEnabled, setProxyEnabled] = React.useState(false);
  const [proxyServer, setProxyServer] = React.useState("dhtproxy.jami.net");
  const [dhtProxyListUrl, setDhtProxyListUrl] = React.useState("");

  const [allowLookup, setAllowLookup] = React.useState(true);

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState(false);
  const [severity, setSeverity] = React.useState("success");

  const searchUsers = (value) => {
    axios(
      configApiCall(
        api_path_get_user_directory_search,
        "GET",
        { queryString: value ? value : "*", page: "1" },
        null
      )
    )
      .then((response) => {
        let profiles = [];
        const profilesResults = response.data.profiles;
        profilesResults.forEach((profile) =>{
            let existingUser = false;
            users.forEach((user)=>{
              if(profile.username === user.username) existingUser = true;
            })
            if(!existingUser) profiles.push(profile);
        })
        setUsers(profiles);
      })
      .catch((error) => {
        setUsers([]);
        if (error.response.status === 401) {
          auth.authenticated = false;
          history.push("/");
        }
      });
  };

  React.useEffect(() => {
    searchUsers();
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
        setDefaultModerators(policyData["defaultModerators"]);

        setUpnpEnabled(policyData["upnpEnabled"]);
        setTurnEnabled(policyData["turnEnabled"]);
        setTurnServer(policyData["turnServer"]);
        setTurnServerUserName(policyData["turnServerUserName"]);
        setTurnServerPassword(policyData["turnServerPassword"]);
        setProxyEnabled(policyData["proxyEnabled"]);
        setProxyServer(policyData["proxyServer"]);
        setDhtProxyListUrl();
        setAllowLookup(policyData["allowLookup"]);

        policyData["defaultModerators"].split("/").forEach((id) => {
          if(id !== "undefined" && id !== ""){
            axios(configApiCall(api_path_get_ns_name_from_addr + id), null, null).then((usernameResponse) => {
              let username = usernameResponse.data.name;
              axios(configApiCall(api_path_get_user_profile + username), null, null).then((userProfileResponse) => {
                let userProfiles = blueprintModerators;
                userProfileResponse.data["id"] = id;
                userProfiles.push(userProfileResponse.data)
                setBlueprintModerators(userProfiles);
                // This state update is added to refresh the list of moderators
                setOpenDrawer(true);
                setOpenDrawer(false);
              });
            });
          }
        })
      })
      .catch((error) => {
        console.log(
          "Error fetching blueprint permissions : " +
            props.blueprintName +
            " " +
            error
        );
      });
  }, [props.blueprintName]);

  const handleUpdatePermissions = (field, value) => {
    let data = {
      videoEnabled: videoEnabled,
      publicInCalls: publicInCalls,
      autoAnswer: autoAnswer,
      peerDiscovery: peerDiscovery,
      accountDiscovery: peerDiscovery,
      accountPublish: peerDiscovery,
      rendezVous: rendezVous,
      defaultModerators: defaultModerators,
      upnpEnabled: upnpEnabled,
      turnEnabled: turnEnabled,
      turnServer: turnServer,
      turnServerUserName: turnServerUserName,
      turnServerPassword: turnServerPassword,
      proxyEnabled: proxyEnabled,
      proxyServer: proxyServer,
      dhtProxyListUrl: dhtProxyListUrl,
      allowLookup: allowLookup,
    };

    if (field === "peerDiscovery") {
      data.peerDiscovery = value;
      data.accountDiscovery = value;
      data.accountPublish = value;
    } else {
      data[field] = value;
    }

    if (turnEnabled === undefined) {
      delete data.turnEnabled;
      delete data.turnServer;
      delete data.turnServerUserName;
      delete data.turnServerPassword;
    }

    if (proxyEnabled === undefined) {
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
        setMessage(i18next.t("updated_blueprint_permissions_successfully", "Blueprint permissions successfully updated."));
      })
      .catch((error) => {
        setOpen(false);
        setSeverity("error");
        setOpen(true);
        setMessage(i18next.t("error_updating_blueprint_permissions", "Error occurred while updating blueprint permissions.") + error + "!");
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addModeratorToBlueprint = (user) => {
      handleUpdatePermissions("defaultModerators", defaultModerators + user.id + "/");
      setDefaultModerators(defaultModerators + user.id + "/");
      let newBlueprintModerators = blueprintModerators;
      newBlueprintModerators.push(user);
      setBlueprintModerators(newBlueprintModerators);
  }

  const removeModeratorFromBlueprint = (user) => {
    let newDefaultModerators = defaultModerators.replace( user.id + "/", "")
    handleUpdatePermissions("defaultModerators", newDefaultModerators);
    setDefaultModerators(newDefaultModerators);
    let newBlueprintModerators = blueprintModerators;
    newBlueprintModerators.splice(newBlueprintModerators.indexOf(user), 1);
    setBlueprintModerators(newBlueprintModerators);
  }

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
      <TemporaryDrawer 
          openDrawer={openDrawer} 
          setOpenDrawer={setOpenDrawer} 
          direction="right" 
          placeholder={i18next.t("add_moderator_to_blueprint", "Add moderator to blueprint ...")} 
          searchTargets={searchUsers} 
          targets={users}
          existingTargets={blueprintModerators}
          addElementToTarget={addModeratorToBlueprint}
          type="user"
      />
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card profile>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <PriorityHighOutlinedIcon />
              </CardIcon>
              <p className={classes.cardCategory}>{i18next.t("permissions", "Permissions")}</p>
              <h3 className={classes.cardTitle}>{props.blueprintName}</h3>
            </CardHeader>
            <CardBody profile>
              <div className={classes.root}>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={12} md={12}>
                  <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12}>
                    <FormLabel component="legend">Call parameters</FormLabel>
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
                        label={i18next.t("allow_video_calls", "Allow video calls")}
                      />
                      <CustomPopupState message={i18next.t("allow_incoming_calls_from_unknown_allow_video_calls_info", "If this option is disabled, only audio calls will be allowed.")} />
                    </FormGroup>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={publicInCalls}
                            color="primary"
                            onChange={(e) => {
                              setPublicInCalls(e.target.checked);
                              handleUpdatePermissions(
                                "publicInCalls",
                                e.target.checked
                              );
                            }}
                            name="publicInCalls"
                          />
                        }
                        label={i18next.t("allow_incoming_calls_from_unknown_contacts", "Allow incoming calls from unknown contacts")}
                      />
                      <CustomPopupState message={i18next.t("allow_incoming_calls_from_unknown_contacts_info", "If this option is disabled, only contacts from your list will be allowed to contact you.")} />
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
                        label={i18next.t("auto_answer_calss", "Auto answer calls")}
                      />
                      <CustomPopupState message={i18next.t("auto_answer_calls_info", "If this option is enabled, incomming calls will be automaticly answered. This option can be usefull if you want for example to monitor your house or a particular room when you are away from home.")} />
                    </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                    <FormLabel component="legend">Local LAN</FormLabel>
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
                        label={i18next.t("allow_use_of_jami_in_local_lan", "Allow Jami usage on the local LAN")}
                      />
                      <CustomPopupState message={i18next.t("local_lan_info", "If this option is enabled, you will be able to communicate with connected contacts on you local lan, even if your lan is disconnected from internet.")} />
                    </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                    <FormLabel component="legend">Allow Lookup</FormLabel>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={allowLookup}
                            color="primary"
                            onChange={(e) => {
                              setAllowLookup(e.target.checked);
                              handleUpdatePermissions(
                                "allowLookup",
                                e.target.checked
                              );
                            }}
                            name="allowLookup"
                          />
                        }
                        label={i18next.t("allow_jami_user_to_search_for_other_contacts", "Allow Jami user to search for other contacts")}
                      />
                      <CustomPopupState message={i18next.t("local_lan_info", "If this option is enabled, users will be able to search for other contacts and add them.")} />
                    </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>

                    </Grid>
                  </Grid>
                </Grid>
                </Grid>
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
                    <h3>Rendezvous mode</h3>

                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Switch
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
                            inputProps={{ "aria-label": "secondary checkbox" }}
                          />
                          }
                          label={i18next.t("convert_your_account_into_a_rendezvous_point", "Activate this account into rendezvous mode")}
                        />
                        <CustomPopupState message={i18next.t("rendezvous_info", "If this option is enabled, incomming calls will automaticly be added to a conference room.")}/>
                        <Button disabled={!rendezVous} color="primary" onClick={() => {setOpenDrawer(true)}}><AddCircleOutlineIcon /> {i18next.t("add_moderator_to", "Add moderator to")} {props.blueprintName}</Button>
                        <CustomPopupState message={i18next.t("rendezvous_moderators_info", "Moderators are people allowed to manage rendezvous points and conferences even if they are not hosted on their devices.")} />
                        </FormGroup>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left"></TableCell>
                                <TableCell align="left">{i18next.t("username", "Username")}</TableCell>
                                <TableCell align="left">{i18next.t("first_name", "First name")}</TableCell>
                                <TableCell align="left">{i18next.t("last_name", "Last name")}</TableCell>
                                <TableCell align="right">{i18next.t("action", "Action")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {blueprintModerators.map(user =>                       
                                <TableRow key={user.username} className={classes.tableRow}>
                                    <TableCell  className={tableCellClasses}>
                                        <Link to={`/user/${user.username}`}>
                                            <Avatar
                                                style={{ marginRight: "10px" }}
                                                alt={user.username}
                                                src={
                                                    user.profilePicture
                                                    ? "data:image/png;base64, " + user.profilePicture
                                                    : noProfilePicture
                                                }
                                            />
                                        </Link>
                                    </TableCell>
                                    <TableCell className={tableCellClasses}>
                                        <Link to={`/user/${user.username}`}>{user.username}</Link>
                                    </TableCell>
                                    <TableCell className={tableCellClasses}>
                                        <Link to={`/user/${user.username}`}>{user.firstName}</Link>
                                    </TableCell>
                                    <TableCell className={tableCellClasses}>
                                        <Link to={`/user/${user.username}`}>{user.lastName}</Link>
                                    </TableCell>
                                    <TableCell align="right" className={classes.tableActions}>
                                        <Button disabled={!rendezVous} color="primary" onClick={() => removeModeratorFromBlueprint(user)}>{i18next.t("remove_moderator", "Remove moderator")}</Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </GridItem>
      </GridContainer>
    </div>
  );
}
