import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import noProfilePicture from "assets/img/faces/no-profile-picture.png";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import GroupIcon from "@material-ui/icons/Group";

import Grid from "@material-ui/core/Grid";
import BusinessCenterOutlinedIcon from "@material-ui/icons/BusinessCenterOutlined";
import AlternateEmailOutlinedIcon from "@material-ui/icons/AlternateEmailOutlined";
import PhoneInTalkOutlinedIcon from "@material-ui/icons/PhoneInTalkOutlined";
import SmartphoneOutlinedIcon from "@material-ui/icons/SmartphoneOutlined";
import LocalPrintshopOutlinedIcon from "@material-ui/icons/LocalPrintshopOutlined";
import PhoneForwardedOutlinedIcon from "@material-ui/icons/PhoneForwardedOutlined";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";


import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import DoneIcon from "@material-ui/icons/Done";
import CardAvatar from "components/Card/CardAvatar";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";

import LinearProgress from "@material-ui/core/LinearProgress";

import auth from "auth.js";
import configApiCall from "api.js";
import {
  api_path_get_admin_user,
  api_path_get_auth_user,
  api_path_get_user_profile,
  api_path_delete_admin_user_revoke,
  api_path_get_list_group,
  api_path_put_update_group,
} from "globalUrls";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

import { hexToRgb, blackColor } from "assets/jss/material-dashboard-react.js";
import axios from "axios";
import PersonIcon from "../../../node_modules/@material-ui/icons/Person";

import VpnKeyIcon from "@material-ui/icons/VpnKey";

import PasswordDialog from "components/PasswordDialog/PasswordDialog";

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
  footerActionButtons:{
    display: "flex",
    flexDirection: "row",
    "& button": {
      marginRight: "1rem"
    },
  },
  footerActionButtonsRight:{
    display: "flex",
    justifyContent: "flex-end",
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
    [theme.breakpoints.down("sm")]: {
      margin: "-50px 50px 0",
    },
  },
  loading: {
    width: "100%",
  },
});

const useStyles = makeStyles(styles);

export default function DisplayUserProfile(props) {
  const classes = useStyles();
  const history = useHistory();
  const [user, setUser] = React.useState([]);
  const [revoked, setRevoked] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [revokedUser, setRevokedUser] = React.useState("");
  const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  
  const [groups, setGroups] = React.useState([]);
  const [zeroGroup, setZeroGroup] = React.useState(false);

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
                const groupMemberships = response.data.groupMemberships;
                axios(
                  configApiCall(
                    api_path_get_list_group + "?groupName=*",
                    "GET",
                    null,
                    null
                  )
                )
                  .then((response) => {
                    let allGroups = response.data;
                    if (allGroups.length === 0) setZeroGroup(true);
                    else {
                      setZeroGroup(false);

                      allGroups.forEach((group) => {
                        group.actif = false;
                      });

                      allGroups.forEach((group) => {
                        groupMemberships.forEach((userGroup) => {
                          if (group.name === userGroup) {
                            group.actif = true;
                          }
                        });
                      });
                    }
                    setGroups(allGroups);
                    setLoading(false);
                  })
                  .catch((error) => {
                    console.log(error);
                    if (error.response.status === 401) {
                      auth.authenticated = false;
                      history.push("/");
                    }
                  });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
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
                setLoading(false);
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
    return () => {
      clearInterval(timer);
    };
  }, []);

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

  const updateUserGroup = (group) => {
    const newGroups = groups;
    newGroups.forEach((g) => {
      if (g === group) {
        if (group.actif) g.actif = false;
        else g.actif = true;
      }
    });
    let url = "";
    if (group.blueprint == null) {
      url =
        api_path_put_update_group +
        "?groupName=" +
        group.name +
        "&newName=" +
        group.name +
        "&blueprintName=&groupMembers=" +
        [props.username];
    } else {
      url =
        api_path_put_update_group +
        "?groupName=" +
        group.name +
        "&newName=" +
        group.name +
        "&blueprintName=" +
        group.blueprint +
        "&groupMembers=" +
        [props.username];
    }

    axios(configApiCall(url, "PUT", null, null))
      .then(() => {
        setGroups(newGroups);
      })
      .catch((error) => {
        console.log("Error updating group: " + error);
      });
  };

  
  return (
  <div>
      <div className={classes.loading}>
        {loading && (
          <LinearProgress variant="determinate" value={progress} />
        )}
      </div>

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
            {i18next.t("are_you_sure_want_revoke", "Are you sure you want to revoke")} <strong>{revokedUser}</strong> ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {i18next.t("cancel", "Cancel")}
          </Button>
          <Button onClick={revokeUser} color="info" autoFocus>
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
      {!loading && (
      <GridContainer>
        <Grid item xs={12} sm={12} md={8}>
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
                        <h3 className={classes.cardTitle}>
                          {user.username}
                        </h3>
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
                          <ListItemText primary={`${user.firstName} ${user.lastName}`} />
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
                  </Grid>

                  <Grid item xs={12} sm={12} md={6}>
                    <List dense={false}>
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
                      {auth.hasAdminScope() && !zeroGroup && (
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <GroupIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <div className={classes.groups}>
                            {groups.map((group) => (
                              <Chip
                                style={{ flex: 1 }}
                                label={group.name}
                                variant="default"
                                clickable
                                size="medium"
                                onClick={() => updateUserGroup(group)}
                                color={group.actif ? "primary" : "default"}
                                icon={group.actif ? <DoneIcon /> : ""}
                              />
                            ))}
                          </div>
                        </ListItem>
                      )}
                    </List>
                  </Grid>
                </Grid>
              </div>
            </CardBody>
            <CardFooter>
              <Grid container className={classes.footerActionButtons}>
                <Grid item >
                  {auth.isLocalDirectory() && (
                    <Button
                      color="info"
                      onClick={() => props.setDisplayUser(false)}
                    >
                      <EditIcon /> {i18next.t("edit_profile", "Edit Profile")}
                    </Button>
                  )}
                  </Grid>
                  <Grid item >
                  {auth.isLocalDirectory() && auth.hasAdminScope() && (
                    <Button
                      color="info"
                      onClick={() => {
                        setChangePasswordOpen(true);
                      }}
                    >
                      <VpnKeyIcon /> {i18next.t("change_password", "Change password")}
                    </Button>
                  )}
                  </Grid>
              </Grid>

              <Grid container className={classes.footerActionButtonsRight}>
                <Grid item>
                {auth.hasAdminScope() && revoked === false && (
                  <Button
                    color="info"
                    onClick={() => handleClickOpen(user.username)}
                  >
                    <DeleteIcon fontSize="small" /> {i18next.t("revoke_user", "Revoke user")}
                  </Button>
                )}
                </Grid>
              </Grid>
            </CardFooter>
          </Card>
        </Grid>
      </GridContainer>
      )}
    </div>
    </div>
  );
}
