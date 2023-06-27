import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import classnames from "classnames";

// @mui/material components
import { makeStyles } from "@mui/styles";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import noProfilePicture from "assets/img/faces/no-profile-picture.png";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";

import Grid from "@mui/material/Grid";
import GridItem from "components/Grid/GridItem.js";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import PhoneForwardedOutlinedIcon from "@mui/icons-material/PhoneForwardedOutlined";

import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import CardAvatar from "components/Card/CardAvatar";
import PersonIcon from "../../../node_modules/@mui/icons-material/Person";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";

import LinearProgress from "@mui/material/LinearProgress";

import auth from "auth.js";
import configApiCall from "api.js";
import {
  api_path_get_admin_user,
  api_path_get_auth_user,
  api_path_get_user_profile,
  api_path_delete_admin_user_revoke,
  api_path_get_list_group,
  api_path_get_group,
  api_path_post_group_member,
  api_path_get_admin_user_groups,
  api_path_delete_group_member,
} from "globalUrls";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

import { hexToRgb, blackColor } from "assets/jss/material-dashboard-react.js";
import axios from "axios";

import PasswordDialog from "components/PasswordDialog/PasswordDialog";

import TemporaryDrawer from "components/Drawer/Drawer";

import i18next from "i18next";

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
  profileFooter: {
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
    },
  },
  footerActionButtons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "end",
    "& button": {
      marginRight: "1rem",
    },
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "stretch",
      "& button": {
        marginRight: "0",
        width: "100%",
      },
    },
  },
  footerActionButtonsRight: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "end",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "stretch",
      "& button": {
        marginRight: "0",
        width: "100%",
      },
    },
  },
  userProfileHeader: {
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
    },
  },
  groups: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  cardAvatarMobile: {
    [theme.breakpoints.down("md")]: {
      textAlign: "center",
    },
  },
  loading: {
    width: "100%",
  },
  whiteButtonText: {
    color: "white",
  },
});

const useStyles = makeStyles(styles);

export default function DisplayUserProfile(props) {
  const classes = useStyles();
  const history = useHistory();
  const [user, setUser] = useState({});
  const [groupMemberships, setGroupMemberships] = useState([]);
  const [revoked, setRevoked] = useState(false);
  const [open, setOpen] = useState(false);
  const [revokedUser, setRevokedUser] = useState("");
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [groups, setGroups] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);

  const searchGroups = (value) => {
    if (value === "") value = "*";
    axios(
      configApiCall(
        api_path_get_list_group + "?groupName=" + value,
        "GET",
        null,
        null
      )
    )
      .then((response) => {
        let availableGroups = [];
        const groupResults = response.data;
        groupResults.forEach((possibleGroup) => {
          let existingGroup = false;
          groups.forEach((actualGroup) => {
            if (actualGroup === possibleGroup.name) {
              existingGroup = true;
              return;
            }
          });
          if (!existingGroup) availableGroups.push(possibleGroup);
        });
        setGroups(availableGroups);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            auth.authenticated = false;
            history.push("/");
          } else {
            setGroups([]);
          }
        } else {
          setGroups([]);
        }
      });
  };

  const removeUserFromGroup = (group) => {
    let data = {
      username: props.username,
    };

    axios(
      configApiCall(
        api_path_delete_group_member + group.groupId,
        "DELETE",
        data,
        null
      )
    )
      .then(() => {
        let newGroupMemberships = groupMemberships;
        newGroupMemberships.splice(newGroupMemberships.indexOf(group), 1);
        setGroupMemberships(newGroupMemberships);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addUserToGroup = (group) => {
    let data = {
      username: props.username,
    };

    axios(
      configApiCall(api_path_post_group_member + group.id, "POST", data, null)
    )
      .then(() => {
        let newGroupMemberships = groupMemberships;
        newGroupMemberships.push({
          groupId: group.id,
          name: group.name,
        });
        setGroupMemberships(newGroupMemberships);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setLoading(true);
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);
    const userData = {
      username: props.username,
    };
    auth.checkDirectoryType(() => {
      if (auth.hasAdminScope()) {
        axios(configApiCall(api_path_get_admin_user, "GET", userData, null))
          .then((response) => {
            const result = JSON.parse(
              response.data.replace(/\s+/g, " ").trim()
            );
            setRevoked(result.revoked);
            axios(
              configApiCall(
                api_path_get_user_profile + props.username,
                "GET",
                null,
                null
              )
            )
              .then((response) => {
                setUser(response.data);
                axios(
                  configApiCall(
                    api_path_get_admin_user_groups + props.username,
                    "GET",
                    null,
                    null
                  )
                )
                  .then((userGroups) => {
                    let userGroupsData = userGroups.data;
                    userGroupsData.forEach((group) => {
                      axios(
                        configApiCall(
                          api_path_get_group + group.groupId,
                          "GET",
                          null,
                          null
                        )
                      ).then((groupInfo) => {
                        group["name"] = groupInfo.data.name;
                      });
                    });
                    setGroupMemberships(userGroupsData);
                  })
                  .catch((error) => {
                    if (error.response.status === 401) {
                      auth.authenticated = false;
                      history.push("/signin");
                    }
                    if (error.response.status === 404) {
                      setGroupMemberships([]);
                    }
                  });
                searchGroups("*");
                setLoading(false);
              })
              .catch((error) => {
                if (error.response.status === 401) {
                  auth.authenticated = false;
                  history.push("/signin");
                }
              });
          })
          .catch((error) => {
            if (error.response.status === 401) {
              auth.authenticated = false;
              history.push("/signin");
            }
          });
      } else {
        axios(
          configApiCall(
            api_path_get_auth_user + "?username=" + props.username,
            "GET",
            null,
            null
          )
        )
          .then((response) => {
            const result = JSON.parse(
              response.data.replace(/\s+/g, " ").trim()
            );
            setRevoked(result.revoked);
            axios(
              configApiCall(
                api_path_get_user_profile + props.username,
                "GET",
                null,
                null
              )
            )
              .then((response) => {
                setUser(response.data);
                axios(
                  configApiCall(
                    api_path_get_admin_user_groups + props.username,
                    "GET",
                    null,
                    null
                  )
                )
                  .then((userGroups) => {
                    let userGroupsData = userGroups.data;
                    userGroupsData.forEach((group) => {
                      axios(
                        configApiCall(
                          api_path_get_group + group.groupId,
                          "GET",
                          null,
                          null
                        )
                      ).then((groupInfo) => {
                        group["name"] = groupInfo.data.name;
                      });
                    });
                    setGroupMemberships(userGroupsData);
                  })
                  .catch((error) => {
                    if (error.response.status === 401) {
                      auth.authenticated = false;
                      history.push("/signin");
                    }
                    if (error.response.status === 404) {
                      setGroupMemberships([]);
                    }
                  });
                setLoading(false);
              })
              .catch((error) => {
                if (error.response.status === 401) {
                  auth.authenticated = false;
                  history.push("/signin");
                }
              });
          })
          .catch((error) => {
            if (error.response.status === 401) {
              auth.authenticated = false;
              history.push("/signin");
            }
          });
      }
    });
    return () => {
      clearInterval(timer);
    };
  }, [history, props.username]);

  const getUserStatus = () => {
    if (revoked === false) {
      return (
        <Chip
          style={{ flex: 1 }}
          label={i18next.t("active", "Active")}
          variant="outlined"
          clickable={false}
        />
      );
    } else {
      return (
        <Chip
          style={{ flex: 1 }}
          label={i18next.t("revoked", "Revoked")}
          variant="outlined"
          clickable={false}
          disabled
        />
      );
    }
  };

  const revokeUser = () => {
    const data = {
      username: revokedUser,
    };

    axios(
      configApiCall(api_path_delete_admin_user_revoke, "DELETE", data, null)
    )
      .then(() => {
        setRevoked(true);
      })
      .catch((error) => {
        console.log(
          "Error revoking user: " + revokedUser + " with error: " + error
        );
      });
    setOpen(false);
  };

  const handleClickOpen = (username) => {
    setRevokedUser(username);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClosechangePassword = () => {
    setChangePasswordOpen(false);
  };

  const tableCellClasses = classnames(classes.tableCell);

  const canEdit = () => {
    if (auth.isLocalDirectory()) {
      if (!auth.hasAdminScope() && auth.getUsername() !== user.username) {
        return false;
      }
      return true;
    } else return false;
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {i18next.t("revoke_user_account", "Revoke user account")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {i18next.t(
              "are_you_sure_want_revoke",
              "Are you sure you want to revoke"
            )}{" "}
            <strong>{revokedUser}</strong> ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {i18next.t("cancel", "Cancel")}
          </Button>
          <Button
            onClick={revokeUser}
            color="info"
            className={classes.whiteButtonText}
            autoFocus
          >
            {i18next.t("revoke", "Revoke")}
          </Button>
        </DialogActions>
      </Dialog>
      <PasswordDialog
        username={props.username}
        changePasswordOpen={changePasswordOpen}
        setChangePasswordOpen={setChangePasswordOpen}
        handleClosechangePassword={handleClosechangePassword}
      />
      <div className={classes.loading}>
        {loading && <LinearProgress variant="determinate" value={progress} />}
      </div>
      <TemporaryDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        direction="right"
        placeholder={i18next.t("add_user_to_group", "Add user to group ...")}
        searchTargets={searchGroups}
        targets={groups}
        existingTargets={groupMemberships}
        addElementToTarget={addUserToGroup}
        targetName={props.username}
        type="group"
      />
      {!loading && (
        <GridContainer>
          <Grid item xs={12} sm={12} md={6}>
            <Card profile>
              <CardBody profile>
                <div className={classes.root}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6}>
                      <CardAvatar
                        displayProfile
                        className={classes.cardAvatarMobile}
                      >
                        <img
                          src={
                            user.profilePicture
                              ? "data:image/png;base64, " + user.profilePicture
                              : noProfilePicture
                          }
                          className={classes.editProfilePicture}
                          alt="..."
                        />
                      </CardAvatar>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <div className={classes.userProfileHeader}>
                        <div>
                          <h3 className={classes.cardTitle}>{user.username}</h3>
                          {getUserStatus()}
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <List dense={false}>
                        {(user.firstName || user.lastName) && (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <PersonIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={`${user.firstName} ${user.lastName}`}
                            />
                          </ListItem>
                        )}
                        {user.phoneNumber && (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <PhoneInTalkOutlinedIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={user.phoneNumber} />
                          </ListItem>
                        )}
                        {user.organization && (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <BusinessCenterOutlinedIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={user.organization} />
                          </ListItem>
                        )}
                      </List>

                      <List dense={false}>
                        {user.email && (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <AlternateEmailOutlinedIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={user.email} />
                          </ListItem>
                        )}
                        {user.phoneNumberExtension && (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <PhoneForwardedOutlinedIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={user.phoneNumberExtension} />
                          </ListItem>
                        )}
                        {user.mobileNumber && (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <SmartphoneOutlinedIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={user.mobileNumber} />
                          </ListItem>
                        )}
                        {user.faxNumber && (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <LocalPrintshopOutlinedIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={user.faxNumber} />
                          </ListItem>
                        )}
                      </List>
                    </Grid>
                  </Grid>
                </div>
              </CardBody>
              <CardFooter className={classes.profileFooter}>
                <Grid container className={classes.footerActionButtons}>
                  <Grid item>
                    {canEdit() && (
                      <Button
                        color="info"
                        className={classes.whiteButtonText}
                        onClick={() => props.setDisplayUser(false)}
                      >
                        <EditIcon /> {i18next.t("edit_profile", "Edit profile")}
                      </Button>
                    )}
                  </Grid>
                  <Grid item>
                    {auth.isLocalDirectory() && auth.hasAdminScope() && (
                      <Button
                        color="info"
                        className={classes.whiteButtonText}
                        onClick={() => {
                          setChangePasswordOpen(true);
                        }}
                      >
                        <VpnKeyIcon />{" "}
                        {i18next.t("change_password", "Change password")}
                      </Button>
                    )}
                  </Grid>
                </Grid>

                <Grid container className={classes.footerActionButtonsRight}>
                  <Grid item>
                    {auth.hasAdminScope() && revoked === false && (
                      <Button
                        color="info"
                        className={classes.whiteButtonText}
                        onClick={() => handleClickOpen(user.username)}
                      >
                        <DeleteIcon fontSize="small" />{" "}
                        {i18next.t("revoke_user", "Revoke user")}
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </CardFooter>
            </Card>
          </Grid>
          {auth.hasAdminScope() && (
            <GridItem xs={12} sm={12} md={12}>
              <Button
                color="primary"
                onClick={() => {
                  setOpenDrawer(true);
                }}
              >
                <AddCircleOutlineIcon />{" "}
                {i18next.t("add_user_to_a_group", "Add user to a group")}
              </Button>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      {i18next.t("group_name", "Group name")}
                    </TableCell>
                    <TableCell align="right">
                      {i18next.t("action", "Action")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupMemberships !== [] &&
                    groupMemberships.map((group) => (
                      <TableRow key={group} className={classes.tableRow}>
                        <TableCell className={tableCellClasses}>
                          <Link to={`/group/${group.groupId}`}>
                            {group.name}
                          </Link>
                        </TableCell>
                        <TableCell
                          align="right"
                          className={classes.tableActions}
                        >
                          <Button
                            color="primary"
                            onClick={() => removeUserFromGroup(group)}
                          >
                            {i18next.t(
                              "remove_from_group",
                              "Remove from group"
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </GridItem>
          )}
        </GridContainer>
      )}
    </div>
  );
}
