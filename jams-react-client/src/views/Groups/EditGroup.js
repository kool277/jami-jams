import React, { useCallback, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import classnames from "classnames";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";

import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import InputLabel from "@material-ui/core/InputLabel";

import Select from "@material-ui/core/Select";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import EditIcon from "@material-ui/icons/Edit";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";

import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";

import axios from "axios";
import configApiCall from "../../api";
import {
  api_path_get_list_group,
  api_path_get_group,
  api_path_put_update_group,
  api_path_get_user_directory_search,
  api_path_get_user_profile,
  api_path_blueprints,
  api_path_get_group_members,
  api_path_post_group_member,
  api_path_delete_group_member,
} from "../../globalUrls";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import devicesStyle from "assets/jss/material-dashboard-react/components/devicesStyle.js";
import Avatar from "@material-ui/core/Avatar";

import noProfilePicture from "assets/img/faces/no-profile-picture.png";

import TemporaryDrawer from "components/Drawer/Drawer";
import * as tool from "../../tools";

import i18next from "i18next";

import auth from "auth.js";

import { debounce } from "lodash";

import { getBlueprintsOptions } from "./getBlueprintsOptions";

const useStyles = makeStyles(() => ({
  ...devicesStyle,
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
  dialogPaper: {
    minHeight: "60vh",
    maxHeight: "60vh",
    minWidth: "80vh",
    maxWidth: "80vh",
  },
  inputBottomMargin: {
    marginBottom: "1rem",
  },
}));

export default function EditGroup(props) {
  const classes = useStyles();
  const history = useHistory();

  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [blueprints, setBlueprints] = useState([]);
  const [selectedBlueprint, setSelectedBlueprint] = useState({
    value: 0,
    label: "No blueprint",
  });
  const [groupMembers, setGroupMembers] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [groupNameExits, setGroupNameExits] = useState(false);
  const [users, setUsers] = useState([]);

  const getUserInfo = (username) =>
    new Promise((resolve, reject) => {
      axios(
        configApiCall(api_path_get_user_profile + username, "GET", null, null)
      )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });

  const getGroup = () => {
    axios(configApiCall(api_path_get_group + props.groupid, "GET", null, null))
      .then((response) => {
        let group = response.data;

        axios(configApiCall(api_path_blueprints + "?name=*", "GET", null, null))
          .then((response) => {
            setBlueprints(response.data);
            response.data.forEach((blueprint, i) => {
              if (blueprint.name === group["blueprint"])
                setSelectedBlueprint({ value: i, label: blueprint.name });
            });
          })
          .catch((error) => {
            if (error.response.status === 401) {
              auth.authenticated = false;
              history.push("/signin");
            }
            if (error.response.status === 500) {
              setBlueprints([]);
            }
          });

        axios(
          configApiCall(
            api_path_get_group_members + props.groupid,
            "GET",
            null,
            null
          )
        )
          .then((response) => {
            let members = response.data;
            members.forEach((member) => {
              getUserInfo(member.username).then((userInfo) => {
                let newGroupMembers = groupMembers;
                newGroupMembers.push(userInfo);
                setGroupMembers(newGroupMembers);

                //This state update is added to force the groupMembers to displayed on first page loading
                setOpenDrawer(true);
                setOpenDrawer(false);
              });
            });
          })
          .catch((error) => {
            if (error.response.status === 404) {
              setGroupMembers([]);
            }
            if (error.response.status === 401) {
              auth.authenticated = false;
              history.push("/signin");
            }
          });

        setName(group.name);
        setNewName(group.name);
      })
      .catch((error) => {
        console.log(
          "Error fetching group members of: " + props.name + " " + error
        );
      });
  };

  const blueprintsOptionsItems = tool.buildSelectMenuItems(
    getBlueprintsOptions(blueprints)
  );

  const updateGroup = (blueprintValue) => {
    let data = {
      name: newName,
      blueprint: blueprintValue ? blueprintValue : selectedBlueprint.label,
    };

    axios(
      configApiCall(
        api_path_put_update_group + props.groupid,
        "PUT",
        data,
        null
      )
    )
      .then(() => {
        setName(newName);
      })
      .catch((error) => {
        console.log("Error updating group: " + error);
      });
  };

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
        profilesResults.forEach((profile) => {
          let existingUser = false;
          users.forEach((user) => {
            if (profile.username === user.username) existingUser = true;
          });
          if (!existingUser) profiles.push(profile);
        });
        setUsers(profiles);
      })
      .catch((error) => {
        setUsers([]);
        if (error.response.status === 401) {
          auth.authenticated = false;
          history.push("/signin");
        }
      });
  };

  const addUserInGroup = (user) => {
    let data = {
      username: user.username,
    };
    axios(
      configApiCall(
        api_path_post_group_member + props.groupid,
        "POST",
        data,
        null
      )
    )
      .then(() => {
        let newGroupMembers = groupMembers;
        newGroupMembers.push(user);
        setGroupMembers(newGroupMembers);

        //This state update is added to force the groupMembers to refreshed displayed
        setOpenDrawer(true);
        setOpenDrawer(false);
      })
      .catch((error) => {
        if (error.response.status === 409) {
          alert(`${user.username} is already part of ${name}`);
        } else console.log("Error updating group: " + error);
      });
  };

  const deleteUserFromGroup = (user) => {
    let data = {
      username: user.username,
    };
    axios(
      configApiCall(
        api_path_delete_group_member + props.groupid,
        "DELETE",
        data,
        null
      )
    )
      .then(() => {
        let newGroupMembers = groupMembers;
        newGroupMembers.splice(newGroupMembers.indexOf(user), 1);
        setGroupMembers(newGroupMembers);

        //This state update is added to force the groupMembers to refreshed displayed
        setOpenDrawer(true);
        setOpenDrawer(false);
      })
      .catch((error) => {
        console.log("Error updating group: " + error);
      });
  };

  const handleBlueprintsChange = (e) => {
    const option = getBlueprintsOptions(blueprints)[e.target.value];
    updateGroup(option.label !== "No blueprint found" ? option.label : "");
    setSelectedBlueprint(option);
  };

  const initCheckGroupNameExists = useCallback(
    debounce(
      (searchGroupNameValue) =>
        handleCheckGroupNameExists(searchGroupNameValue),
      500
    ),
    []
  );

  const handleCheckGroupNameExists = (searchGroupNameValue) => {
    axios(
      configApiCall(
        api_path_get_list_group + "?groupName=" + searchGroupNameValue,
        "GET",
        null,
        null
      )
    )
      .then((response) => {
        setGroupNameExits(false);
        response.data.forEach((group) => {
          if (searchGroupNameValue === group.name) {
            setGroupNameExits(true);
          }
        });
      })
      .catch(() => {
        setGroupNameExits(false);
      });
  };

  useEffect(() => {
    getGroup();
    searchUsers();
  }, []);

  const tableCellClasses = classnames(classes.tableCell);

  return (
    <div>
      <TemporaryDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        direction="right"
        placeholder={i18next.t("add_user_to_group", "Add user to group ...")}
        searchTargets={searchUsers}
        targets={users}
        existingTargets={groupMembers}
        addElementToTarget={addUserInGroup}
        targetName={name}
        type="user"
      />
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card profile>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <EditIcon />
              </CardIcon>
              <p className={classes.cardCategory}>
                {i18next.t("edit_group", "Edit group")}
              </p>
              <h3 className={classes.cardTitle}>{name}</h3>
            </CardHeader>
            <CardBody profile>
              <div className={classes.root}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12}>
                    <FormControl
                      className={classes.margin}
                      size="medium"
                      error={groupNameExits}
                    >
                      <Input
                        id="name"
                        placeholder={name}
                        startAdornment={
                          <InputAdornment position="start">
                            <PeopleOutlineIcon />
                          </InputAdornment>
                        }
                        endAdornment={
                          <IconButton
                            color="primary"
                            aria-label="update name"
                            component="span"
                            onClick={() => {
                              updateGroup();
                            }}
                            disabled={groupNameExits || name === newName}
                          >
                            <SaveIcon />
                          </IconButton>
                        }
                        onChange={(e) => {
                          setNewName(e.target.value);
                          initCheckGroupNameExists(e.target.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <InputLabel
                      className={classes.inputBottomMargin}
                      htmlFor="blueprint"
                    >
                      {i18next.t("select_blueprint", "Select a blueprint")}
                    </InputLabel>
                    <FormControl className={classes.margin} fullWidth>
                      <Select
                        labelId="demo-simple-select-label"
                        fullWidth
                        value={selectedBlueprint.value}
                        onChange={handleBlueprintsChange}
                        variant="outlined"
                        disabled={blueprints.length === 0}
                      >
                        {blueprintsOptionsItems}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Button
            color="primary"
            onClick={() => {
              setOpenDrawer(true);
            }}
          >
            <AddCircleOutlineIcon /> {i18next.t("add_user_to", "Add user to")}{" "}
            {name}
          </Button>
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
              {groupMembers.map((user) => (
                <TableRow key={user.username} className={classes.tableRow}>
                  <TableCell className={tableCellClasses}>
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
                    <Button
                      color="primary"
                      onClick={() => deleteUserFromGroup(user)}
                    >
                      {i18next.t("remove_user", "Remove user")}
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
