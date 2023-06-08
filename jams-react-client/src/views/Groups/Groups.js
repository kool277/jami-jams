import React, { useEffect, useState, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
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
  api_path_get_group_members,
} from "globalUrls";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
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

import i18next from "i18next";

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
  whiteButtonText: {
    color: "white",
  },
  inputBottomMargin: {
    marginBottom: "1rem",
  },
};

const useStyles = makeStyles(styles);

export default function Groups() {
  const classes = useStyles();
  const history = useHistory();
  const [groups, setGroups] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [zeroGroup, setZeroGroup] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState(null);

  const [blueprints, setBlueprints] = React.useState([]);

  const [openCreate, setOpenCreate] = React.useState(false);
  const [groupName, setGroupName] = React.useState("");
  const [groupNameExits, setGroupNameExits] = React.useState(false);

  const [removedGroup, setRemovedGroup] = React.useState({
    id: 0,
    name: "groupeName",
  });
  const [openRemoveDialog, setOpenRemoveDialog] = React.useState();

  const [disableCreate, setDisableCreate] = React.useState(true);

  const handleRemoveGroup = (group) => {
    setRemovedGroup(group);
    setOpenRemoveDialog(true);
  };

  const removeGroup = () => {
    axios(
      configApiCall(
        api_path_delete_group + removedGroup.id,
        "DELETE",
        null,
        null
      )
    )
      .then((response) => {
        console.log("Successfully deleted " + removedGroup.name);
        setOpenRemoveDialog(false);
      })
      .catch((error) => {
        console.log("Could not delete " + removedGroup.name + " " + error);
        setOpenRemoveDialog(false);
      });

    history.push("/groups");
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

  const getBlueprints = () => {
    axios(configApiCall(api_path_blueprints + "?name=*", "GET", null, null))
      .then((response) => {
        setBlueprints(response.data);
        setSelectedBlueprint(getBlueprintsOptions()[0]);
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

    axios(configApiCall(api_path_get_list_group, "GET", null, null))
      .then((response) => {
        let allGroups = response.data;

        allGroups.forEach((group) => {
          axios(
            configApiCall(
              api_path_get_group_members + group.id,
              "GET",
              null,
              null
            )
          )
            .then((response) => {
              group["groupMembersLength"] = response.data.length;
            })
            .catch((error) => {
              if (error.response.status === 401) {
                auth.authenticated = false;
                history.push("/");
              }
              if (error.response.status === 404) {
                group["groupMembersLength"] = 0;
              }
            });
        });
        setGroups(allGroups);
        getBlueprints();
        setLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          auth.authenticated = false;
          history.push("/signin");
        }
        if (error.response.status === 404) {
          getBlueprints();
          setZeroGroup(true);
        }
      });
    return () => {
      clearInterval(timer);
    };
  }, [openCreate, openRemoveDialog, history]);

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
        let allGroups = response.data;
        setDisableCreate(false);
        setGroupNameExits(false);
        allGroups.forEach((group) => {
          if (searchGroupNameValue === group.name) {
            setDisableCreate(true);
            setGroupNameExits(true);
          }
        });
      })
      .catch((error) => {
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
      .then((response) => {
        console.log("Successfully  created " + groupName);
        setOpenCreate(false);
        history.push(`/group/${response.data.id}`);
      })
      .catch((error) => {
        alert("Error creating group: " + error);
        setOpenCreate(false);
      });
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
          {i18next.t(
            "you_are_not_allowed_to_access_this_section",
            "You are not allowed to access this section. Please contact your administrator to get administrator privileges."
          )}
        </h4>
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
          <DialogTitle id="alert-dialog-title">
            {i18next.t("create_group", "Create group")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12}>
                  <FormControl
                    className={classes.margin}
                    error={groupNameExits}
                    fullWidth
                  >
                    <InputLabel htmlFor="groupName">
                      {i18next.t("group_name", "Group name")}
                    </InputLabel>
                    <Input
                      id="groupName"
                      placeholder={i18next.t("group_name", "Group name")}
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
                    <p>
                      {i18next.t(
                        "group_name_already_exists",
                        "Group name already exists!"
                      )}
                    </p>
                  )}
                  {disableCreate && groupName.length === 0 && (
                    <p>
                      {i18next.t("group_name_is_empty", "Group name is empty")}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <InputLabel
                    className={classes.inputBottomMargin}
                    htmlFor="blueprint"
                  >
                    {i18next.t("select_blueprint", "Select a blueprint")}
                  </InputLabel>
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
            <Button
              onClick={handleCloseCreate}
              color="info"
              className={classes.whiteButtonText}
            >
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
          <DialogTitle id="alert-dialog-title">
            {i18next.t("remove_group", "Remove group")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {i18next.t(
                "are_you_sure_you_want_to_delete",
                "Are you sure you want to delete"
              )}{" "}
              <strong>{removedGroup.name}</strong> ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRemoveDialog(false)} color="primary">
              {i18next.t("cancel", "Cancel")}
            </Button>
            <Button onClick={removeGroup} color="info" autoFocus>
              {i18next.t("remove", "Remove")}
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
                <AddCircleOutlineIcon />{" "}
                {i18next.t("create_group", "Create group")}
              </Button>
            }
            <div className={classes.searchWrapper}>
              {!zeroGroup && (
                <CustomInput
                  formControlProps={{
                    className: classes.margin + " " + classes.search,
                  }}
                  inputProps={{
                    placeholder: i18next.t(
                      "search_groups_placeholder",
                      "Search groups…"
                    ),
                    inputProps: {
                      "aria-label": i18next.t("search_groups", "Search groups"),
                    },
                    onKeyUp: (e) => setSearchValue(e.target.value),
                  }}
                />
              )}
              {!zeroGroup && <Search />}
              <div className={classes.loading}>
                {!zeroGroup && loading && (
                  <LinearProgress variant="determinate" value={progress} />
                )}
              </div>
            </div>
          </GridItem>
          {zeroGroup ? (
            <div className={classes.groupsNotFound}>
              <InfoIcon />{" "}
              <p style={{ marginLeft: "10px" }}>
                {i18next.t("no_groups_found", "No groups Found")}
              </p>
            </div>
          ) : (
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
                <GridItem xs={12} sm={6} md={3} lg={2} xl={2} key={group.name}>
                  <Card profile>
                    <Link to={`/group/${group.id}`}>
                      <CardBody profile>
                        <h3 className={classes.cardTitle}>{group.name}</h3>
                        <ul>
                          <li>
                            <PersonIcon
                              fontSize="small"
                              style={{ marginRight: "10px" }}
                            />
                            <strong style={{ marginRight: "5px" }}>
                              {group.groupMembersLength}
                            </strong>
                            {i18next.t("users", "users")}
                          </li>
                          <li>
                            <MailOutlineIcon
                              fontSize="small"
                              style={{ marginRight: "10px" }}
                            />
                            <strong style={{ marginRight: "5px" }}>
                              {i18next.t("blueprint", "Blueprint")}
                            </strong>
                            {group.blueprint}
                          </li>
                        </ul>
                      </CardBody>
                    </Link>
                    <CardFooter>
                      <IconButton
                        color="secondary"
                        onClick={() => {
                          handleRemoveGroup(group);
                        }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </CardFooter>
                  </Card>
                </GridItem>
              ))
          )}
        </GridContainer>
      </div>
    );
  }
}
