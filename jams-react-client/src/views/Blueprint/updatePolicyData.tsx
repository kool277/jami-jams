import axios from "axios";
import i18next from "i18next";

import configApiCall from "api";
import { api_path_blueprints } from "globalUrls";
import { debounce } from "lodash";
import { DEFAULT_UI_CUSTOMIZATION, PolicyData } from "./policyData.constants";
import { Dispatch, SetStateAction } from "react";
import { SnackbarProps } from "./PolicyDataContext";
import { ServerUiCustomization } from "./ServerUiCustomization";

const updatePerms = (data: PolicyData, field: string, value: boolean) => {
  data.defaultModerators = data.blueprintModerators
    ?.map((moderator) => moderator.id)
    .join("/");
  delete data.blueprintModerators;

  if (field === "peerDiscovery") {
    data.accountDiscovery = value;
    data.accountPublish = value;
  }

  return data;
};

const updateConfig = (data: PolicyData) => {
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

const updateUiCustomization = (data: PolicyData) => {
  if (data.uiCustomization.isCustomizationEnabled === false) {
    return;
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

  const ui: ServerUiCustomization = {
    title: hasTitle ? title : "",
    description: hasDescription ? description : "",
    areTipsEnabled: hasTips,
    backgroundType: "default",
    tipBoxAndIdColor:
      tipBoxAndIdColor !== DEFAULT_UI_CUSTOMIZATION.tipBoxAndIdColor
        ? convertRgbaToArgb(tipBoxAndIdColor)
        : undefined,
    mainBoxColor:
      hasMainBoxColor && mainBoxColor
        ? convertRgbaToArgb(mainBoxColor)
        : undefined,
    logoUrl: hasLogo ? logoUrl : "",
    logoSize:
      logoSize !== DEFAULT_UI_CUSTOMIZATION.logoSize
        ? logoSize
        : DEFAULT_UI_CUSTOMIZATION.logoSize,
  };

  if (hasBackground === false) {
    ui.backgroundType = "default";
  } else if (backgroundUrl) {
    ui.backgroundType = "image";
    ui.backgroundColorOrUrl = backgroundUrl;
  } else if (backgroundColor !== "") {
    ui.backgroundType = "color";
    ui.backgroundColorOrUrl = backgroundColor || "#ffffff";
  }

  console.log("updateUiCustomization", ui);

  return ui;
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

  const ui: ServerUiCustomization | undefined = updateUiCustomization(data);

  console.log("updatePolicyData", { field, value });
  if (ui !== undefined) {
    debouncedSendPutRequest(blueprintName, ui, setSnackbar);
  }
};
