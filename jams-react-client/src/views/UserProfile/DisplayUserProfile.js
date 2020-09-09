import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
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

import Grid from "@material-ui/core/Grid";
import BusinessCenterOutlinedIcon from "@material-ui/icons/BusinessCenterOutlined";
import AlternateEmailOutlinedIcon from "@material-ui/icons/AlternateEmailOutlined";
import PhoneInTalkOutlinedIcon from "@material-ui/icons/PhoneInTalkOutlined";
import SmartphoneOutlinedIcon from "@material-ui/icons/SmartphoneOutlined";
import LocalPrintshopOutlinedIcon from "@material-ui/icons/LocalPrintshopOutlined";
import PhoneForwardedOutlinedIcon from "@material-ui/icons/PhoneForwardedOutlined";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import PermIdentityOutlinedIcon from "@material-ui/icons/PermIdentityOutlined";

import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import DoneIcon from "@material-ui/icons/Done";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";

import auth from "auth.js";
import configApiCall from "api.js";
import {
  api_path_get_admin_user,
  api_path_get_auth_user,
  api_path_get_user_directory_search,
  api_path_delete_admin_user_revoke,
} from "globalUrls";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

import { hexToRgb, blackColor } from "assets/jss/material-dashboard-react.js";
import axios from "axios";
import PersonIcon from "../../../node_modules/@material-ui/icons/Person";

import VpnKeyIcon from "@material-ui/icons/VpnKey";

import PasswordDialog from "components/PasswordDialog/PasswordDialog";

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

  // controls: {
  //     padding: 16,
  //     display: 'flex',
  //     flexDirection: 'column',
  //     alignItems: 'stretch',
  //     [theme.breakpoints.up('sm')]: {
  //       flexDirection: 'row',
  //       alignItems: 'center',
  //     },passwordSchematainer: {
  //     display: 'flex',
  //     flex: '1',
  //     alignItems: 'center',
  //   },
  //   sliderLabel: {
  //     [theme.breakpoints.down('xs')]: {
  //       minWidth: 65,
  //     },
  // },
  // slider: {
  //     padding: '22px 0px',
  //     marginLeft: 16,
  //     [theme.breakpoints.up('sm')]: {
  //         flexDirection: 'row',
  //         alignItems: 'center',
  //         margin: '0 16px',
  //     },
  // },
});

const useStyles = makeStyles(styles);

export default function DisplayUserProfile(props) {
  const classes = useStyles();

  const [users, setUsers] = React.useState([]);
  const [userStatus, setUserStatus] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [revokedUser, setRevokedUser] = React.useState("");
  const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);

  const searchData = {
    queryString: props.username,
  };

  const userData = {
    username: props.username,
  };

  useEffect(() => {
    auth.checkDirectoryType(() => {
      if (auth.hasAdminScope()) {
        axios(configApiCall(api_path_get_admin_user, "GET", userData, null))
          .then((response) => {
            const result = JSON.parse(
              response.data.replace(/\s+/g, " ").trim()
            );
            setUserStatus(result.revoked);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios(configApiCall(api_path_get_auth_user, "GET", userData, null))
          .then((response) => {
            const result = JSON.parse(
              response.data.replace(/\s+/g, " ").trim()
            );
            setUserStatus(result.revoked);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
    axios(
      configApiCall(api_path_get_user_directory_search, "GET", searchData, null)
    )
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getUserStatus = (user) => {
    if (userStatus === false) {
      return (
        <Chip
          label="Active"
          avatar={
            <Avatar
              alt={user.username}
              src={
                user.profilePicture
                  ? "data:image/png;base64, " + user.profilePicture
                  : noProfilePicture
              }
            />
          }
          color="primary"
          deleteIcon={<DoneIcon />}
        />
      );
    } else {
      return (
        <Chip
          label="Revoked"
          avatar={
            <Avatar
              alt={user.username}
              src={
                user.profilePicture
                  ? "data:image/png;base64, " + user.profilePicture
                  : noProfilePicture
              }
            />
          }
          deleteIcon={<DoneIcon />}
        />
      );
    }
  };

  function revokeUser() {
    const data = {
      username: revokedUser,
    };

    axios(
      configApiCall(api_path_delete_admin_user_revoke, "DELETE", data, null)
    )
      .then(() => {
        setUserStatus(true);
      })
      .catch((error) => {
        console.log(
          "Error revoking user: " + revokedUser + " with error: " + error
        );
      });
    setOpen(false);
  }

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

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Revoke user account"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to revoke <strong>{revokedUser}</strong> ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={revokeUser} color="info" autoFocus>
            Revoke
          </Button>
        </DialogActions>
      </Dialog>
      <PasswordDialog
        username={props.username}
        changePasswordOpen={changePasswordOpen}
        setChangePasswordOpen={setChangePasswordOpen}
        handleClosechangePassword={handleClosechangePassword}
      />
      {users.map((user) => (
        <GridContainer>
          <Grid item xs={12} sm={12} md={8}>
            <Card profile>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <PermIdentityOutlinedIcon />
                </CardIcon>
                <p className={classes.cardCategory}>{"Profile information"}</p>
                <h3 className={classes.cardTitle}>{user.username}</h3>
                {getUserStatus(user)}
              </CardHeader>
              <CardBody profile>
                <div className={classes.root}>
                  <Grid container spacing={2}>
                    <Grid item align="center" xs={12} sm={12} md={12}>
                      <img
                        src={
                          user.profilePicture
                            ? "data:image/png;base64, " + user.profilePicture
                            : noProfilePicture
                        }
                        className={classes.editProfilePicture}
                        alt="..."
                      />
                      <h4>{user.username ? user.username : "no username"}</h4>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <List dense={false}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <PersonIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              user.firstName ? user.firstName : "no firstname"
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <PersonOutlinedIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              user.lastName ? user.lastName : "no lastname"
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <AlternateEmailOutlinedIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={user.email ? user.email : "no email"}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <BusinessCenterOutlinedIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              user.organization
                                ? user.organization
                                : "no organization"
                            }
                          />
                        </ListItem>
                      </List>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6}>
                      <List dense={false}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <PhoneInTalkOutlinedIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              user.phoneNumber
                                ? user.phoneNumber
                                : "no phone number"
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <PhoneForwardedOutlinedIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              user.phoneNumberExtension
                                ? user.phoneNumberExtension
                                : "no Extension"
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <SmartphoneOutlinedIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              user.mobileNumber
                                ? user.mobileNumber
                                : "no mobile number"
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <LocalPrintshopOutlinedIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              user.faxNumber ? user.faxNumber : "no fax number"
                            }
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </div>
              </CardBody>
              <CardFooter>
                {auth.isLocalDirectory() && (
                  <Button
                    color="info"
                    onClick={() => props.setDisplayUser(false)}
                  >
                    <EditIcon /> Edit Profile
                  </Button>
                )}
                {auth.isLocalDirectory() && auth.hasAdminScope() && (
                  <Button
                    color="info"
                    onClick={() => {
                      setChangePasswordOpen(true);
                    }}
                  >
                    <VpnKeyIcon /> Change password
                  </Button>
                )}
                {auth.hasAdminScope() &&
                  (userStatus === "Active" || userStatus === "") && (
                    <Button
                      color="info"
                      onClick={() => handleClickOpen(user.username)}
                    >
                      <DeleteIcon fontSize="small" /> Revoke user
                    </Button>
                  )}
              </CardFooter>
            </Card>
          </Grid>
        </GridContainer>
      ))}
    </div>
  );
}
