import axios from "axios";
import i18next from "i18next";

import configApiCall from "api";
import { api_path_blueprints } from "globalUrls";
import { debounce } from "lodash";

const updatePerms = (data, field, value) => {
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

    hasLogo,
    logoUrl,
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
  } else if (backgroundUrl !== "") {
    ui.backgroundType = "image";
    ui.backgroundColorOrUrl = backgroundUrl;
  } else if (backgroundColor !== "") {
    ui.backgroundType = "color";
    ui.backgroundColorOrUrl = backgroundColor;
  } else {
    ui.backgroundType = "default";
  }

  if (hasLogo === false) {
    ui.logoUrl = "";
  } else if (logoUrl !== "") {
    ui.logoUrl = logoUrl;
  }

  console.log("updateUiCustomization", ui);
  data.uiCustomization = JSON.stringify(ui);
  return data;
};

const sendPutRequest = (blueprintName, data, setSnackbar) => {
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
  blueprintName,
  policyData,
  setPolicyData,
  field,
  value,
  setSnackbar
) => {
  setPolicyData((state) => ({ ...state, [field]: value }));

  let data = { ...policyData, [field]: value };
  data = updatePerms(data, field, value);
  data = updateConfig(data);
  data = updateUiCustomization(data);

  console.log("updatePolicyData", { field, value });

  debouncedSendPutRequest(blueprintName, data, setSnackbar);
};
