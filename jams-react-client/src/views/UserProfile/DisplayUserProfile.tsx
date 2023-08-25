import React, { FC, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import i18next from "i18next";

import { makeStyles } from "@mui/styles";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Chip,
  LinearProgress,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import VpnKeyIcon from "@mui/icons-material/VpnKey";

import auth from "auth";
import configApiCall from "api";
import {
  api_path_get_admin_user,
  api_path_get_auth_user,
  api_path_get_user_profile,
  api_path_delete_admin_user_revoke,
  api_path_get_group,
  api_path_get_admin_user_groups,
  api_path_delete_group_member,
} from "globalUrls";

import GridContainer from "components/Grid/GridContainer";
import Button from "components/CustomButtons/Button";
import Card from "components/Card/Card";
import CardAvatar from "components/Card/CardAvatar";
import CardBody from "components/Card/CardBody";
import CardFooter from "components/Card/CardFooter";
import PasswordDialog from "components/PasswordDialog/PasswordDialog";

import noProfilePicture from "assets/img/faces/no-profile-picture.png";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle";
import { hexToRgb, blackColor } from "assets/jss/material-dashboard-react";
import UserProfileFieldsList from "./UserProfileFieldsList";
import AdminAddUserToGroup from "./AdminAddUserToGroup";

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
    [theme.breakpoints.down("lg")]: {
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
    [theme.breakpoints.down("lg")]: {
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
    [theme.breakpoints.down("lg")]: {
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
    [theme.breakpoints.down("lg")]: {
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
    [theme.breakpoints.down("lg")]: {
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

interface DisplayUserProfileProps {
  setDisplayUser: (displayUser: boolean) => void;
  username: string;
}

export interface UserProfile {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  organization: string;
  phoneNumber: string;
  phoneNumberExtension: string;
  faxNumber: string;
  mobileNumber: string;
}

export interface GroupMembership {
  groupId: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  blueprint: string;
}

interface UserGroup {
  groupId: string;
  username: string;
}

const DisplayUserProfile: FC<DisplayUserProfileProps> = ({
  setDisplayUser,
  username,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [user, setUser] = useState<UserProfile>({});
  const [groupMemberships, setGroupMemberships] = useState<GroupMembership[]>(
    []
  );
  const [revoked, setRevoked] = useState(false);
  const [open, setOpen] = useState(false);
  const [revokedUser, setRevokedUser] = useState("");
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);

  const removeUserFromGroup = (group: GroupMembership) => {
    axios(
      configApiCall(
        api_path_delete_group_member + group.groupId,
        "DELETE",
        { username },
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

    return () => {
      clearInterval(timer);
    };
  }, [history, username]);

  const getAdminUserGroups = () => {
    axios(
      configApiCall(
        api_path_get_admin_user_groups + username,
        "GET",
        null,
        null
      )
    ).then((userGroups) => {
      let userGroupsData: UserGroup[] = userGroups.data;
      userGroupsData.forEach((group) => {
        axios(
          configApiCall(api_path_get_group + group.groupId, "GET", null, null)
        ).then((groupInfo) => {
          group["name"] = groupInfo.data.name;
        });
      });
      setGroupMemberships(userGroupsData);
    });
  };

  useEffect(() => {
    auth.checkDirectoryType(() => {
      const requestConfig = auth.hasAdminScope()
        ? configApiCall(api_path_get_admin_user, "GET", { username }, null)
        : configApiCall(
            api_path_get_auth_user + "?username=" + username,
            "GET",
            null,
            null
          );

      axios(requestConfig)
        .then((response) => {
          const result = response.data;
          setRevoked(result.revoked);
          axios(
            configApiCall(
              api_path_get_user_profile + username,
              "GET",
              null,
              null
            )
          ).then((response) => {
            setUser(response.data);
            getAdminUserGroups();
            setLoading(false);
          });
        })
        .catch((error) => {
          if (error.response.status === 401) {
            auth.authenticated = false;
            history.push("/signin");
          }
        });
    });
  }, [history, username]);

  const getUserStatus = () => {
    const label = revoked
      ? i18next.t("revoked", "Revoked")
      : i18next.t("active", "Active");
    return (
      <Chip
        style={{ flex: 1 }}
        label={label}
        variant="outlined"
        clickable={false}
        disabled={revoked}
      />
    );
  };

  const revokeUser = () => {
    axios(
      configApiCall(
        api_path_delete_admin_user_revoke,
        "DELETE",
        { username: revokedUser },
        null
      )
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

  const handleClickOpen = (username: string) => {
    setRevokedUser(username);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const canEdit = () => {
    if (!auth.isLocalDirectory()) {
      return false;
    }
    if (!auth.hasAdminScope() && auth.getUsername() !== user.username) {
      return false;
    }
    return true;
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
        username={username}
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
      <div className={classes.loading}>
        {loading && <LinearProgress variant="determinate" value={progress} />}
      </div>
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
                    <UserProfileFieldsList user={user} />
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
                        onClick={() => setDisplayUser(false)}
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
          <AdminAddUserToGroup
            username={username}
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            classes={classes}
            groupMemberships={groupMemberships}
            setGroupMemberships={setGroupMemberships}
            removeUserFromGroup={removeUserFromGroup}
          />
        </GridContainer>
      )}
    </div>
  );
};

export default DisplayUserProfile;
