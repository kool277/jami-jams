import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import i18next from "i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  InputAdornment,
  DialogActions,
  debounce,
  TextField,
} from "@mui/material";
import { AllInbox } from "@mui/icons-material";

import configApiCall from "api";
import { api_path_blueprints } from "globalUrls";

import Button from "components/CustomButtons/Button";

const getHelperText = (disableCreate, blueprintName) => {
  if (disableCreate && blueprintName.length > 0) {
    return i18next.t(
      "blueprint_name_already_exists",
      "Blueprint name already exists!"
    );
  }
  if (disableCreate && blueprintName.length === 0) {
    return i18next.t("blueprint_name_is_empty", "Blueprint name is empty");
  }

  return "";
};

export default function CreateBlueprintDialog({ open, setOpen }) {
  const history = useHistory();

  const [blueprintName, setBlueprintName] = useState("");
  const [blueprintNameExists, setBlueprintNameExists] = useState(false);
  const [disableCreate, setDisableCreate] = useState(true);

  const helperText = getHelperText(disableCreate, blueprintName);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckBlueprintNameExists = (searchBlueprintNameValue) => {
    setDisableCreate(true);
    axios(
      configApiCall(
        api_path_blueprints + "?name=" + searchBlueprintNameValue,
        "GET",
        null,
        null
      )
    )
      .then(() => {
        setDisableCreate(true);
        setBlueprintNameExists(true);
      })
      .catch(() => {
        setDisableCreate(false);
        setBlueprintNameExists(false);
      });
  };

  const initCheckBlueprintNameExists = useCallback(
    debounce(
      (searchBlueprintNameValue) =>
        handleCheckBlueprintNameExists(searchBlueprintNameValue),
      500
    ),
    []
  );

  const handleCreateBlueprint = () => {
    const defaultPolicyData = {
      videoEnabled: true,
      publicInCalls: false,
      allowCertFromContact: true,
      allowCertFromHistory: true,
      allowCertFromTrusted: true,
      autoAnswer: false,
      peerDiscovery: true,
      accountDiscovery: true,
      accountPublish: true,
      rendezVous: false,
      defaultModerators: "",
      upnpEnabled: true,
      allowLookup: true,
    };

    axios(
      configApiCall(
        api_path_blueprints + "?name=" + blueprintName,
        "POST",
        defaultPolicyData,
        null
      )
    )
      .then(() => {
        setOpen(false);
        setDisableCreate(true);
        console.log("Successfully created " + blueprintName);
      })
      .catch((error) => {
        setOpen(false);
        console.log("Could not create " + blueprintName + " " + error);
      });
    history.push(`/blueprint/${blueprintName}`);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {i18next.t("create_blueprint", "Create blueprint")}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          error={blueprintNameExists}
          margin="dense"
          id="blueprintName"
          label={i18next.t("blueprint_name", "Blueprint name")}
          helperText={helperText}
          type="text"
          variant="standard"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AllInbox />
              </InputAdornment>
            ),
          }}
          onChange={(e) => {
            setBlueprintName(e.target.value);
            initCheckBlueprintNameExists(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {i18next.t("cancel", "Cancel")}
        </Button>
        <Button
          onClick={handleCreateBlueprint}
          color="info"
          disabled={disableCreate}
        >
          {i18next.t("create_blueprint", "Create blueprint")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
