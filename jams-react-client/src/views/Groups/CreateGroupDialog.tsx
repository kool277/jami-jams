import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  InputAdornment,
  DialogActions,
  TextField,
  ClassNameMap,
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
import Button from "components/CustomButtons/Button";
import { Group } from "./Groups";

const getHelperText = (disableCreate: boolean, groupName: string) => {
  if (disableCreate && groupName.length > 0) {
    return i18next.t(
      "group_name_already_exists",
      "Group name already exists!"
    ) as string;
  }
  if (disableCreate && groupName.length === 0) {
    return i18next.t("group_name_is_empty", "Group name is empty") as string;
  }

  return "";
};

export default function CreateGroupDialog({
  openCreate,
  setOpenCreate,
  classes,
}: {
  openCreate: boolean;
  setOpenCreate: (value: boolean) => void;
  classes: ClassNameMap<string>;
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

  const helperText = getHelperText(disableCreate, groupName);

  const handleCheckGroupNameExists = (searchGroupNameValue: string) => {
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
        const allGroups = response.data;
        setDisableCreate(false);
        setGroupNameExits(false);
        allGroups.forEach((group: Group) => {
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

  const handleBlueprintsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSelectedBlueprint(
      getBlueprintsOptions(blueprints)[parseInt(e.target.value)]
    );
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
        {i18next.t("create_group", "Create group") as string}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12}>
            <TextField
              autoFocus
              error={groupNameExits}
              id="groupName"
              label={i18next.t("group_name", "Group name") as string}
              helperText={helperText}
              type="text"
              fullWidth
              variant="standard"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PeopleOutlineIcon />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                setGroupName(e.target.value);
                initCheckGroupNameExists(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <TextField
              select
              fullWidth
              label={
                i18next.t("select_blueprint", "Select a blueprint") as string
              }
              value={selectedBlueprint.value}
              onChange={handleBlueprintsChange}
              disabled={blueprints.length === 0}
            >
              {blueprintsOptionsItems}
            </TextField>
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
