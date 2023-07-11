import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import i18next from "i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  DialogActions,
  Button,
  debounce,
} from "@mui/material";
import { AllInbox } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";

import configApiCall from "api";
import { api_path_blueprints } from "globalUrls";
import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle";

const styles = {
  ...headerLinksStyle,
  whiteButtonText: {
    color: "white",
  },
};

const useStyles = makeStyles(styles);

export default function CreateBlueprintDialog({ open, setOpen }) {
  const history = useHistory();
  const classes = useStyles();

  const [blueprintName, setBlueprintName] = useState("");
  const [blueprintNameExits, setBlueprintNameExits] = useState(false);
  const [disableCreate, setDisableCreate] = useState(true);

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
        setBlueprintNameExits(true);
      })
      .catch(() => {
        setDisableCreate(false);
        setBlueprintNameExits(false);
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
    let defaultPolicyData = {
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
        <FormControl
          className={classes.margin}
          size="medium"
          error={blueprintNameExits}
        >
          <InputLabel htmlFor="blueprintName">
            {i18next.t("blueprint_name", "Blueprint name")}
          </InputLabel>
          <Input
            id="blueprintName"
            placeholder={i18next.t("blueprint_name", "Blueprint name")}
            startAdornment={
              <InputAdornment position="start">
                <AllInbox />
              </InputAdornment>
            }
            onChange={(e) => {
              setBlueprintName(e.target.value);
              initCheckBlueprintNameExists(e.target.value);
            }}
          />
        </FormControl>
        {disableCreate && blueprintName.length > 0 && (
          <p>
            {i18next.t(
              "blueprint_name_already_exists",
              "Blueprint name already exists!"
            )}
          </p>
        )}
        {disableCreate && blueprintName.length === 0 && (
          <p>
            {i18next.t("blueprint_name_is_empty", "Blueprint name is empty")}
          </p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {i18next.t("cancel", "Cancel")}
        </Button>
        <Button
          onClick={handleCreateBlueprint}
          color="info"
          className={classes.whiteButtonText}
          disabled={disableCreate}
          autoFocus
        >
          {i18next.t("create_blueprint", "Create blueprint")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
