import axios from "axios";
import i18next from "i18next";

import configApiCall from "api";
import { api_path_blueprints } from "globalUrls";
import { debounce } from "lodash";
import { DEFAULT_UI_CUSTOMIZATION, PolicyData } from "./policyData.constants";
import { Dispatch, SetStateAction } from "react";
import { SnackbarProps } from "./PolicyDataContext";
import { ServerUiCustomization } from "./ServerUiCustomization";

const updatePerms = (data, field: string, value: any) => {
  data.defaultModerators = data.blueprintModerators
    .map((moderator) => moderator.id)
    .join("/");
  delete data.blueprintModerators;

  if (field === "peerDiscovery") {
    data.accountDiscovery = value;
    data.accountPublish = value;
  }

  return data;
};

const updateConfig = (data) => {
  const { selectedTurnOption, selectedDHTProxyOption } = data;
  // if undefined, it means we want the default values
  if (selectedTurnOption !== "customTurn") {
    delete data.turnServer;
    delete data.turnServerUserName;
    delete data.turnServerPassword;
  }

  if (selectedDHTProxyOption !== "customDHTProxy") {
    delete data.proxyServer;
    delete data.dhtProxyListUrl;
  }

  if (selectedTurnOption === "customTurn") {
    data.turnEnabled = true;
  } else if (selectedTurnOption === "disabledTurn") {
    data.turnEnabled = false;
  }
  delete data.selectedTurnOption;

  if (selectedDHTProxyOption === "customDHTProxy") {
    data.proxyEnabled = true;
  } else if (selectedDHTProxyOption === "disabledDHTProxy") {
    data.proxyEnabled = false;
  }
  delete data.selectedDHTProxyOption;

  return data;
};

const convertRgbaToArgb = (rgba: string) => {
  if (rgba.length === 7) {
    return rgba;
  }
  if (rgba.length !== 9) {
    throw new Error(`Invalid rgba value: "${rgba}}"`);
  }

  return "#" + rgba.substring(7, 9) + rgba.substring(1, 7);
};

const updateUiCustomization = (data) => {
  if (data.uiCustomization.isCustomizationEnabled === false) {
    return data;
  }

  const {
    hasTitle,
    title,
    hasDescription,
    description,
    hasTips,

    hasBackground,
    backgroundColor,
    backgroundUrl,

    tipBoxAndIdColor,
    hasMainBoxColor,
    mainBoxColor,

    hasLogo,
    logoUrl,
    logoSize,
  } = data.uiCustomization;
  const ui = {};

  if (hasTitle === false) {
    ui.title = "";
  } else if (title !== "") {
    ui.title = title;
  }

  if (hasDescription === false) {
    ui.description = "";
  } else if (description !== "") {
    ui.description = description;
  }

  ui.areTipsEnabled = hasTips;

  if (hasBackground === false) {
    ui.backgroundType = "default";
  } else if (backgroundUrl) {
    ui.backgroundType = "image";
    ui.backgroundColorOrUrl = backgroundUrl;
  } else if (backgroundColor !== "") {
    ui.backgroundType = "color";
    ui.backgroundColorOrUrl = backgroundColor || "#ffffff";
  } else {
    ui.backgroundType = "default";
  }

  if (tipBoxAndIdColor !== DEFAULT_UI_CUSTOMIZATION.tipBoxAndIdColor) {
    ui.tipBoxAndIdColor = convertRgbaToArgb(tipBoxAndIdColor);
  }
  if (hasMainBoxColor === true && mainBoxColor) {
    ui.mainBoxColor = convertRgbaToArgb(mainBoxColor);
  }

  if (hasLogo === false) {
    ui.logoUrl = "";
  } else if (logoUrl !== "") {
    ui.logoUrl = logoUrl;
  }
  if (logoSize !== DEFAULT_UI_CUSTOMIZATION.logoSize) {
    ui.logoSize = logoSize;
  }

  console.log("updateUiCustomization", ui);
  data.uiCustomization = JSON.stringify(ui);
  return data;
};

const sendPutRequest = (
  blueprintName: string,
  data: ServerUiCustomization,
  setSnackbar: (snackbar: SnackbarProps) => void
) => {
  console.log("PUT", data);

  axios(
    configApiCall(
      api_path_blueprints + "?name=" + blueprintName,
      "PUT",
      data,
      null
    )
  )
    .then(() => {
      const message = i18next.t(
        "updated_blueprint_permissions_successfully",
        "Blueprint permissions successfully updated."
      );
      setSnackbar({
        open: true,
        severity: "success",
        message,
      });
    })
    .catch((error) => {
      const msg = i18next.t(
        "error_updating_blueprint_permissions",
        "Error occurred while updating blueprint permissions."
      );
      setSnackbar({
        open: true,
        severity: "error",
        message: `${msg} ${error}!`,
      });
    });
};

const debouncedSendPutRequest = debounce(sendPutRequest, 200, {
  trailing: true,
});

export const _updatePolicyData = (
  blueprintName: string,
  policyData: PolicyData,
  setPolicyData: Dispatch<SetStateAction<PolicyData>>,
  field: string,
  value: any,
  setSnackbar: (snackbar: SnackbarProps) => void
) => {
  setPolicyData((state) => ({ ...state, [field]: value }));

  let data: any = { ...policyData, [field]: value };
  data = updatePerms(data, field, value);
  data = updateConfig(data);
  data = updateUiCustomization(data);

  const ui: ServerUiCustomization = data;

  console.log("updatePolicyData", { field, value });

  debouncedSendPutRequest(blueprintName, ui, setSnackbar);
};
