import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import Search from "@material-ui/icons/Search";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PersonIcon from "@material-ui/icons/Person";
import InfoIcon from "@material-ui/icons/Info";

import Select from "@material-ui/core/Select";

import * as tool from "../../tools";
import axios from "axios";
import configApiCall from "api.js";
import auth from "auth.js";
import {
  api_path_post_create_group,
  api_path_get_list_group,
  api_path_delete_group,
  api_path_blueprints,
} from "globalUrls";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturn";
import EditGroup from "views/Groups/EditGroup";

import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { debounce } from "lodash";

import LinearProgress from "@material-ui/core/LinearProgress";

const styles = {
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
  deleteIcon: {
    float: "right",
  },
  search: {
    width: "90%",
  },
  loading: {
    width: "100%",
  },
  groupsNotFound: {
    marginLeft: "10px",
    display: "flex",
    alignItems: "center",
  },
};

const useStyles = makeStyles(styles);

export default function Groups() {
  const classes = useStyles();
  const history = useHistory();
  const [groups, setGroups] = React.useState([]);
  const [selectedGroupName, setSelectedGroupName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [zeroGroup, setZeroGroup] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState(null);

  const [blueprints, setBlueprints] = React.useState([]);

  const [openCreate, setOpenCreate] = React.useState(false);
  const [groupName, setGroupName] = React.useState("");
  const [groupNameExits, setGroupNameExits] = React.useState(false);

  const [removedGroup, setRemovedGroup] = React.useState();
  const [openRemoveDialog, setOpenRemoveDialog] = React.useState();

  const [disableCreate, setDisableCreate] = React.useState(true);

  const handleRemoveGroup = (groupRemovedName) => {
    setRemovedGroup(groupRemovedName);
    setOpenRemoveDialog(true);
  };

  const removeGroup = () => {
    axios(
      configApiCall(
        api_path_delete_group + "?groupName=" + removedGroup,
        "DELETE",
        null,
        null
      )
    )
      .then((response) => {
        console.log("Successfully deleted " + removedGroup);
        setOpenRemoveDialog(false);
      })
      .catch((error) => {
        console.log("Could not delete " + removedGroup + " " + error);
        setOpenRemoveDialog(false);
      });

    history.push("/admin/groups");
  };

  const loadBlueprints = () => {
    axios(configApiCall(api_path_blueprints + "?name=*", "GET", null, null))
      .then((response) => {
        setBlueprints(response.data);
        setSelectedBlueprint(getBlueprintsOptions()[0]);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 401) {
          auth.authenticated = false;
          history.push("/");
        }
        if (error.response.status === 500) {
          setBlueprints([]);
        }
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

    axios(
      configApiCall(api_path_get_list_group + "?groupName=*", "GET", null, null)
    )
      .then((response) => {
        let allGroups = response.data;
        if (allGroups.length === 0) setZeroGroup(true);
        else {
          setZeroGroup(false);
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
    loadBlueprints();
    return () => {
      clearInterval(timer);
    };
  }, [openCreate, openRemoveDialog]);

  const [selectedGroup, setSelectedGroup] = useState(false);

  const redirectToGroup = (e, name) => {
    e.preventDefault();
    setSelectedGroup(true);
    setSelectedGroupName(name);
  };

  const handleCheckGroupNameExists = (searchGroupNameValue) => {
    setDisableCreate(true);
    axios(
      configApiCall(
        api_path_get_list_group + "?groupName=" + searchGroupNameValue,
        "GET",
        null,
        null
      )
    )
      .then((response) => {
        setDisableCreate(true);
        setGroupNameExits(true);
      })
      .catch((error) => {
        console.log(error);
        setDisableCreate(false);
        setGroupNameExits(false);
      });
  };

  const initCheckGroupNameExists = useCallback(
    debounce(
      (searchGroupNameValue) =>
        handleCheckGroupNameExists(searchGroupNameValue),
      500
    ),
    []
  );

  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  const handleCreateGroup = () => {
    let blueprintName = "";
    if (selectedBlueprint.label !== "No blueprint")
      blueprintName = selectedBlueprint.label;

    axios(
      configApiCall(
        api_path_post_create_group +
          "?name=" +
          groupName +
          "&blueprintName=" +
          blueprintName,
        "POST",
        null,
        null
      )
    )
      .then(() => {
        console.log("Successfully  created " + groupName);
        setOpenCreate(false);
      })
      .catch((error) => {
        console.log("Error creating group: " + error);
        setOpenCreate(false);
      });
    history.push("/admin/groups");
  };

  const getBlueprintsOptions = () => {
    let blueprintsOptions = [];
    let index = 0;
    if (blueprints.length === 0)
      blueprintsOptions.push({ value: index, label: "No blueprint found" });
    else {
      blueprints.map((blueprint) => {
        blueprintsOptions.push({ value: index, label: blueprint.name });
        index += 1;
      });
    }
    return blueprintsOptions;
  };

  const blueprintsOptionsItems = tool.buildSelectMenuItems(
    getBlueprintsOptions()
  );

  const [selectedBlueprint, setSelectedBlueprint] = useState({
    value: 0,
    label: "No blueprint",
  });

  const handleBlueprintsChange = (e) => {
    setSelectedBlueprint(getBlueprintsOptions()[e.target.value]);
  };

  if (!auth.hasAdminScope()) {
    return (
      <div>
        <h4>
          You are not allowed to access this section. Please contact your
          administrator to get administrator privileges.
        </h4>
      </div>
    );
  } else if (selectedGroup && auth.hasAdminScope()) {
    return (
      <div>
        <EditGroup
          groupName={selectedGroupName}
          initCheckGroupNameExists={initCheckGroupNameExists}
          groupNameExits={groupNameExits}
          blueprintsOptionsItems={blueprintsOptionsItems}
          handleBlueprintsChange={handleBlueprintsChange}
          getBlueprintsOptions={getBlueprintsOptions}
          blueprints={blueprints}
          disableCreate={disableCreate}
        />
      </div>
    );
  } else {
    return (
      <div>
        <Dialog
          open={openCreate}
          onClose={handleCloseCreate}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Create group"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12}>
                  <FormControl
                    className={classes.margin}
                    error={groupNameExits}
                    fullWidth
                  >
                    <InputLabel htmlFor="groupName">Group name</InputLabel>
                    <Input
                      id="groupName"
                      placeholder="Group Name"
                      startAdornment={
                        <InputAdornment position="start">
                          <PeopleOutlineIcon />
                        </InputAdornment>
                      }
                      onChange={(e) => {
                        setGroupName(e.target.value);
                        initCheckGroupNameExists(e.target.value);
                      }}
                    />
                  </FormControl>
                  {disableCreate && groupName.length > 0 && (
                    <p>Group name already exists!</p>
                  )}
                  {disableCreate && groupName.length == 0 && (
                    <p>Group name is empty</p>
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Select
                    labelId="demo-simple-select-label"
                    fullWidth
                    value={selectedBlueprint.value}
                    onChange={handleBlueprintsChange}
                    variant="outlined"
                    children={blueprintsOptionsItems}
                    disabled={blueprints.length === 0}
                  />
                </Grid>
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCreate} color="info">
              Cancel
            </Button>
            <Button
              onClick={handleCreateGroup}
              color="primary"
              disabled={disableCreate}
              autoFocus
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openRemoveDialog}
          onClose={() => setOpenRemoveDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Remove group"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete <strong>{removedGroup}</strong> ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRemoveDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={removeGroup} color="info" autoFocus>
              Remove
            </Button>
          </DialogActions>
        </Dialog>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            {
              <Button
                variant="contained"
                color="primary"
                href="#contained-buttons"
                onClick={(e) => setOpenCreate(true)}
              >
                <AddCircleOutlineIcon /> Create group
              </Button>
            }
            <div className={classes.searchWrapper}>
              {!zeroGroup && (
                <CustomInput
                  formControlProps={{
                    className: classes.margin + " " + classes.search,
                  }}
                  inputProps={{
                    placeholder: "Search groups ...",
                    inputProps: {
                      "aria-label": "Search groups",
                    },
                    onKeyUp: (e) => setSearchValue(e.target.value),
                  }}
                />
              )}
              {!zeroGroup && <Search />}
              <div className={classes.loading}>
                {loading && (
                  <LinearProgress variant="determinate" value={progress} />
                )}
              </div>
            </div>
          </GridItem>
          {zeroGroup ? (
            <div className={classes.groupsNotFound}>
              <InfoIcon /> <p style={{ marginLeft: "10px" }}>No groups Found</p>
            </div>
          ) : groups.length >= 1 ? (
            groups
              .filter((data) => {
                if (searchValue === null) {
                  return data;
                } else {
                  return data.name
                    .toLowerCase()
                    .includes(searchValue.toLowerCase());
                }
              })
              .map((group) => (
                <GridItem xs={12} sm={12} md={2} key={group.name}>
                  <Card profile>
                    <CardBody profile>
                      <a
                        href="#"
                        onClick={(e) => redirectToGroup(e, group.name)}
                      >
                        <h3 className={classes.cardTitle}>{group.name}</h3>
                        <ul>
                          <li>
                            <PersonIcon
                              fontSize="small"
                              style={{ marginRight: "10px" }}
                            />
                            <strong style={{ marginRight: "5px" }}>
                              {group.groupMembers.length}
                            </strong>
                            users
                          </li>
                          <li>
                            <MailOutlineIcon
                              fontSize="small"
                              style={{ marginRight: "10px" }}
                            />
                            <strong style={{ marginRight: "5px" }}>
                              Blueprint
                            </strong>
                            {group.blueprint}
                          </li>
                        </ul>
                      </a>
                    </CardBody>
                    <CardFooter>
                      <IconButton
                        color="secondary"
                        onClick={() => {
                          handleRemoveGroup(group.name);
                        }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </CardFooter>
                  </Card>
                </GridItem>
              ))
          ) : (
            <GridItem xs={12} sm={12} md={2} key={groups.name}>
              <Card profile>
                <CardBody profile>
                  <a href="#" onClick={(e) => redirectToGroup(e, groups.name)}>
                    <h3 className={classes.cardTitle}>{groups.name}</h3>
                    <ul>
                      <li>
                        <PersonIcon
                          fontSize="small"
                          style={{ marginRight: "10px" }}
                        />
                        <strong style={{ marginRight: "5px" }}>
                          {typeof groups.groupMembers !== "undefined"
                            ? groups.groupMembers
                            : 0}
                        </strong>
                        users
                      </li>
                      <li>
                        <MailOutlineIcon
                          fontSize="small"
                          style={{ marginRight: "10px" }}
                        />
                        <strong style={{ marginRight: "5px" }}>
                          Blueprint
                        </strong>
                        {selectedBlueprint.label}
                      </li>
                    </ul>
                  </a>
                </CardBody>
                <CardFooter>
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      handleRemoveGroup(groups.name);
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </CardFooter>
              </Card>
            </GridItem>
          )}
        </GridContainer>
      </div>
    );
  }
}
