import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Select,
  DialogActions,
} from "@mui/material";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import axios from "axios";
import i18next from "i18next";
import { debounce } from "lodash";

import configApiCall from "api";
import {
  api_path_blueprints,
  api_path_get_list_group,
  api_path_post_create_group,
} from "globalUrls";
import { getBlueprintsOptions } from "./getBlueprintsOptions";
import auth from "auth";
import * as tool from "../../tools";
import Button from "components/CustomButtons/Button.js";

export default function CreateGroupDialog({
  openCreate,
  setOpenCreate,
  classes,
}) {
  const history = useHistory();

  const [groupName, setGroupName] = useState("");
  const [groupNameExits, setGroupNameExits] = useState(false);
  const [disableCreate, setDisableCreate] = useState(true);

  const [blueprints, setBlueprints] = useState([]);
  const [selectedBlueprint, setSelectedBlueprint] = useState({
    value: 0,
    label: "No blueprint",
  });

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
      .catch(() => {
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
        api_path_post_create_group,
        "POST",
        { name: groupName, blueprintName },
        null
      )
    )
      .then((response) => {
        console.log("Successfully created " + groupName);
        setOpenCreate(false);
        history.push(`/group/${response.data.id}`);
      })
      .catch((error) => {
        alert("Error creating group: " + error);
        setOpenCreate(false);
      });
  };

  const blueprintsOptionsItems = tool.buildSelectMenuItems(
    getBlueprintsOptions(blueprints)
  );

  const handleBlueprintsChange = (e) => {
    setSelectedBlueprint(getBlueprintsOptions(blueprints)[e.target.value]);
  };

  const getBlueprints = () => {
    axios(configApiCall(api_path_blueprints + "?name=*", "GET", null, null))
      .then((response) => {
        setBlueprints(response.data);
        setSelectedBlueprint(getBlueprintsOptions(response.data)[0]);
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
    getBlueprints();
  }, []);

  return (
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
              <p>{i18next.t("group_name_is_empty", "Group name is empty")}</p>
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
              disabled={blueprints.length === 0}
            >
              {blueprintsOptionsItems}
            </Select>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseCreate} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleCreateGroup}
          color="info"
          className={classes.whiteButtonText}
          disabled={disableCreate}
          autoFocus
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
