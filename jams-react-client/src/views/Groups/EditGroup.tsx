import { useCallback, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import classnames from "classnames";

// @mui/material components
import { makeStyles } from "@mui/styles";

// core components
import Grid from "@mui/material/Grid";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import Button from "components/CustomButtons/Button";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import CardBody from "components/Card/CardBody";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";

import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import InputLabel from "@mui/material/InputLabel";

import Select, { SelectChangeEvent } from "@mui/material/Select";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";

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

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle";
import devicesStyle from "assets/jss/material-dashboard-react/components/devicesStyle";
import Avatar from "@mui/material/Avatar";

import noProfilePicture from "assets/img/faces/no-profile-picture.png";

import TemporaryDrawer from "components/Drawer/Drawer";
import * as tool from "../../tools";

import i18next from "i18next";

import auth from "auth";

import { debounce } from "lodash";

import { getBlueprintsOptions } from "./getBlueprintsOptions";
import { ClassNameMap } from "@mui/material";
import { Blueprint } from "views/Blueprints/Blueprints";
import { UserProfile } from "views/UserProfile/DisplayUserProfile";
import { Group } from "./Groups";

const useStyles = makeStyles(() => ({
  ...(devicesStyle as any),
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

export interface GroupMember {
  username: string;
  groupId: string;
}

interface EditGroupProps {
  groupid: string;
  name?: string;
}

export default function EditGroup(props: EditGroupProps) {
  const classes: ClassNameMap<any> = useStyles();
  const history = useHistory();

  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [selectedBlueprint, setSelectedBlueprint] = useState({
    value: 0,
    label: "No blueprint",
  });
  const [groupMembers, setGroupMembers] = useState<UserProfile[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [groupNameExits, setGroupNameExits] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);

  const getUserInfo = (username: string) =>
    new Promise<UserProfile>((resolve, reject) => {
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
        const group = response.data;

        axios(configApiCall(api_path_blueprints + "?name=*", "GET", null, null))
          .then((response) => {
            setBlueprints(response.data);
            response.data.forEach((blueprint: Blueprint, i: number) => {
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
            const members = response.data;
            members.forEach((member: GroupMember) => {
              getUserInfo(member.username).then((userInfo: UserProfile) => {
                const newGroupMembers: UserProfile[] = groupMembers;
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

  const updateGroup = (blueprintValue?: string) => {
    const data = {
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

  const searchUsers = (value?: string) => {
    axios(
      configApiCall(
        api_path_get_user_directory_search,
        "GET",
        { queryString: value ? value : "*", page: "1" },
        null
      )
    )
      .then((response) => {
        const profiles: UserProfile[] = [];
        const profilesResults = response.data.profiles;
        profilesResults.forEach((profile: UserProfile) => {
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

  const addUserInGroup = (user: UserProfile) => {
    const data = {
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
        const newGroupMembers = groupMembers;
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

  const deleteUserFromGroup = (user: UserProfile) => {
    const data = {
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
        const newGroupMembers = groupMembers;
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

  const handleBlueprintsChange = (e: SelectChangeEvent<number>) => {
    const option = getBlueprintsOptions(blueprints)[e.target.value as number];
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

  const handleCheckGroupNameExists = (searchGroupNameValue: string) => {
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
        response.data.forEach((group: Group) => {
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
        placeholder={
          i18next.t("add_user_to_group", "Add user to group ...") as string
        }
        searchTargets={searchUsers}
        targets={users}
        existingTargets={groupMembers}
        addElementToTarget={addUserInGroup}
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
                {i18next.t("edit_group", "Edit group") as string}
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
                            size="large"
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
                      {
                        i18next.t(
                          "select_blueprint",
                          "Select a blueprint"
                        ) as string
                      }
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
            <AddCircleOutlineIcon />{" "}
            {i18next.t("add_user_to", "Add user to") as string} {name}
          </Button>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="left"></TableCell>
                <TableCell align="left">
                  {i18next.t("username", "Username") as string}
                </TableCell>
                <TableCell align="left">
                  {i18next.t("first_name", "First name") as string}
                </TableCell>
                <TableCell align="left">
                  {i18next.t("last_name", "Last name") as string}
                </TableCell>
                <TableCell align="right">
                  {i18next.t("action", "Action") as string}
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
                      {i18next.t("remove_user", "Remove user") as string}
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
