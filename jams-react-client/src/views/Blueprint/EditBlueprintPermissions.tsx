import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import i18next from "i18next";

// @mui/material components
import { makeStyles } from "@mui/styles";
import Checkbox from "@mui/material/Checkbox";

import Avatar from "@mui/material/Avatar";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";

import { BlueprintSnackbar } from "components/Snackbar/BlueprintSnackbar";
import Button from "components/CustomButtons/Button";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import CustomPopupState from "components/CustomPopupState/CustomPopupState";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import TemporaryDrawer from "components/Drawer/Drawer";

import { hexToRgb, blackColor } from "assets/jss/material-dashboard-react";
import noProfilePicture from "assets/img/faces/no-profile-picture.png";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle";

import auth from "../../auth";
import configApiCall from "../../api";
import { api_path_get_user_directory_search } from "../../globalUrls";

import { PolicyDataContext } from "./PolicyDataContext";

const styles = {
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
};

const useStyles = makeStyles(styles);

export default function EditBlueprintPermissions(props) {
  const classes = useStyles();
  const history = useHistory();

  const { policyData, updatePolicyData, snackbar, setSnackbar } =
    useContext(PolicyDataContext);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [users, setUsers] = useState([]);

  const {
    videoEnabled,
    publicInCalls,
    autoAnswer,
    peerDiscovery,
    rendezVous,
    blueprintModerators,
    allowLookup,
  } = policyData;

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
        const profilesResults = response.data.profiles;
        const usernames = users.map((user) => user.username);

        const profiles = profilesResults.filter((profile) => {
          return !usernames.includes(profile.username);
        });
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

  useEffect(() => {
    searchUsers();
  }, []);

  const addModeratorToBlueprint = (user) => {
    updatePolicyData("blueprintModerators", [...blueprintModerators, user]);
  };

  const removeModeratorFromBlueprint = (user) => {
    const newBlueprintModerators = blueprintModerators.filter(
      (moderator) => moderator.id !== user.id
    );
    updatePolicyData("blueprintModerators", newBlueprintModerators);
  };

  return (
    <div>
      <BlueprintSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
      <TemporaryDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        direction="right"
        placeholder={i18next.t(
          "add_moderator_to_blueprint",
          "Add moderator to blueprint ..."
        )}
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
              <p className={classes.cardCategory}>
                {i18next.t("permissions", "Permissions")}
              </p>
              <h3 className={classes.cardTitle}>{props.blueprintName}</h3>
            </CardHeader>
            <CardBody profile>
              <div className={classes.root}>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={12} md={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12} md={12}>
                        <FormLabel component="legend">
                          {i18next.t("call_parameters", "Call parameters")}
                        </FormLabel>
                        <FormGroup row>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={videoEnabled}
                                color="primary"
                                onChange={(e) => {
                                  updatePolicyData(
                                    "videoEnabled",
                                    e.target.checked
                                  );
                                }}
                                name="videoEnabled"
                              />
                            }
                            label={i18next.t(
                              "allow_video_calls",
                              "Allow video calls"
                            )}
                          />
                          <CustomPopupState
                            message={i18next.t(
                              "allow_incoming_calls_from_unknown_allow_video_calls_info",
                              "If this option is disabled, only audio calls are allowed."
                            )}
                          />
                        </FormGroup>
                        <FormGroup row>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={publicInCalls}
                                color="primary"
                                onChange={(e) => {
                                  updatePolicyData(
                                    "publicInCalls",
                                    e.target.checked
                                  );
                                }}
                                name="publicInCalls"
                              />
                            }
                            label={i18next.t(
                              "allow_incoming_calls_from_unknown_contacts",
                              "Allow incoming calls from unknown contacts"
                            )}
                          />
                          <CustomPopupState
                            message={i18next.t(
                              "allow_incoming_calls_from_unknown_contacts_info",
                              "If this option is disabled, only contacts from your list can contact you."
                            )}
                          />
                        </FormGroup>
                        <FormGroup row>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={autoAnswer}
                                color="primary"
                                onChange={(e) => {
                                  updatePolicyData(
                                    "autoAnswer",
                                    e.target.checked
                                  );
                                }}
                                name="autoAnswer"
                              />
                            }
                            label={i18next.t(
                              "auto_answer_calss",
                              "Auto answer calls"
                            )}
                          />
                          <CustomPopupState
                            message={i18next.t(
                              "auto_answer_calls_info",
                              "If this option is enabled, incoming calls are automatically answered. This option can be useful to monitor your house or a particular room when you are away from home for example."
                            )}
                          />
                        </FormGroup>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12}>
                        <FormLabel component="legend">
                          {i18next.t("local_lan", "Local LAN")}
                        </FormLabel>
                        <FormGroup row>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={peerDiscovery}
                                color="primary"
                                onChange={(e) => {
                                  updatePolicyData(
                                    "peerDiscovery",
                                    e.target.checked
                                  );
                                }}
                                name="peerDiscovery"
                              />
                            }
                            label={i18next.t(
                              "allow_use_of_jami_in_local_lan",
                              "Allow discovery of other peers on a local network"
                            )}
                          />
                          <CustomPopupState
                            message={i18next.t(
                              "local_lan_info",
                              "If this option is enabled, you can communicate with connected contacts on you local lan, even if your lan is disconnected from the Internet."
                            )}
                          />
                        </FormGroup>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12}>
                        <FormLabel component="legend">
                          {i18next.t(
                            "contact_management",
                            "Contact management"
                          )}
                        </FormLabel>
                        <FormGroup row>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={allowLookup}
                                color="primary"
                                onChange={(e) => {
                                  updatePolicyData(
                                    "allowLookup",
                                    e.target.checked
                                  );
                                }}
                                name="allowLookup"
                              />
                            }
                            label={i18next.t(
                              "allow_jami_user_to_search_for_other_contacts",
                              "Allow user to add new contacts"
                            )}
                          />
                          <CustomPopupState
                            message={i18next.t(
                              "lookup_info",
                              "If this option is disabled, user can not search and add new contacts"
                            )}
                          />
                        </FormGroup>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12}></Grid>
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
                    updatePolicyData("rendezVous", e.target.checked);
                  }}
                  name="rendezVous"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                />
              }
              label={i18next.t(
                "convert_your_account_into_a_rendezvous_point",
                "Set the account as a Rendezvous point"
              )}
            />
            <CustomPopupState
              message={i18next.t(
                "rendezvous_info",
                "If this option is enabled, incoming calls are automatically added to a conference room."
              )}
            />
            <Button
              disabled={!rendezVous}
              color="primary"
              onClick={() => {
                setOpenDrawer(true);
              }}
            >
              <AddCircleOutlineIcon />{" "}
              {i18next.t("add_moderator_to", "Add moderator to")}{" "}
              {props.blueprintName}
            </Button>
            <CustomPopupState
              message={i18next.t(
                "rendezvous_moderators_info",
                "Moderators can manage the Rendezvous point."
              )}
            />
          </FormGroup>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="left"></TableCell>
                <TableCell align="left">
                  {i18next.t("username", "Username")}
                </TableCell>
                <TableCell align="left">
                  {i18next.t("first_name", "First name")}
                </TableCell>
                <TableCell align="left">
                  {i18next.t("last_name", "Last name")}
                </TableCell>
                <TableCell align="right">
                  {i18next.t("action", "Action")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blueprintModerators.map((user) => (
                <TableRow key={user.username} className={classes.tableRow}>
                  <TableCell className={classes.tableCell}>
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
                  <TableCell className={classes.tableCell}>
                    <Link to={`/user/${user.username}`}>{user.username}</Link>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Link to={`/user/${user.username}`}>{user.firstName}</Link>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Link to={`/user/${user.username}`}>{user.lastName}</Link>
                  </TableCell>
                  <TableCell align="right" className={classes.tableActions}>
                    <Button
                      disabled={!rendezVous}
                      color="primary"
                      onClick={() => removeModeratorFromBlueprint(user)}
                    >
                      {i18next.t("remove_moderator", "Remove moderator")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </GridItem>
      </GridContainer>
    </div>
  );
}
