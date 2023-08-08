import axios from "axios";

import configApiCall from "../../api";
import {
  api_path_get_ns_name_from_addr,
  api_path_get_user_profile,
} from "../../globalUrls";
import { DEFAULT_UI_CUSTOMIZATION } from "./policyData.constants";

const getModerators = async (defaultModerators) => {
  const moderators = [];
  const ids = defaultModerators.split("/").filter((id) => id !== "");

  for (const id of ids) {
    const usernameResponse = await axios(
      configApiCall(api_path_get_ns_name_from_addr + id, "GET", null, null)
    );
    const username = usernameResponse.data.name;

    const userProfileResponse = await axios(
      configApiCall(api_path_get_user_profile + username, "GET", null, null)
    );
    userProfileResponse.data["id"] = id;
    moderators.push(userProfileResponse.data);
  }

  return moderators;
};

const setPermissionsSettings = async (policyData) => {
  policyData.blueprintModerators = await getModerators(
    policyData.defaultModerators
  );
  delete policyData.defaultModerators;

  return policyData;
};

const setConfigurationSettings = (policyData) => {
  const { turnEnabled, proxyEnabled } = policyData;

  if (turnEnabled === true) {
    policyData.selectedTurnOption = "customTurn";
  } else if (turnEnabled === false) {
    policyData.selectedTurnOption = "disabledTurn";
  } else {
    policyData.selectedTurnOption = "defaultTurn";
  }
  delete policyData.turnEnabled;

  if (proxyEnabled === true) {
    policyData.selectedDHTProxyOption = "customDHTProxy";
  } else if (proxyEnabled === false) {
    policyData.selectedDHTProxyOption = "disabledDHTProxy";
  } else {
    policyData.selectedDHTProxyOption = "defaultDHTProxy";
  }
  delete policyData.proxyEnabled;

  return policyData;
};

const convertArgbToRgba = (argb) => {
  if (argb.length === 7) {
    return argb;
  }
  if (argb.length !== 9) {
    throw new Error(`Invalid argb value: "${argb}}"`);
  }

  return "#" + argb.substr(3, 6) + argb.substr(1, 2);
};

const setCustomizationSettings = (policyData) => {
  if (!policyData.uiCustomization) {
    policyData.uiCustomization = DEFAULT_UI_CUSTOMIZATION;
    return policyData;
  }

  const result = JSON.parse(policyData.uiCustomization);
  const ui = { isCustomizationEnabled: true };

  ui.hasTitle = result.title !== "";
  ui.title = result.title;
  ui.hasDescription = result.description !== "";
  ui.description = result.description;
  ui.hasTips = result.areTipsEnabled;

  if (result.backgroundType === "default") {
    ui.hasBackground = false;
  } else if (result.backgroundType === "color") {
    ui.hasBackground = true;
    ui.backgroundColor = result.backgroundColorOrUrl;
  } else if (result.backgroundType === "image") {
    ui.hasBackground = true;
    ui.backgroundUrl = result.backgroundColorOrUrl;
  }

  ui.tipBoxAndIdColor = result.tipBoxAndIdColor
    ? convertArgbToRgba(result.tipBoxAndIdColor)
    : DEFAULT_UI_CUSTOMIZATION.tipBoxAndIdColor;

  ui.hasMainBoxColor = result.mainBoxColor !== undefined;
  ui.mainBoxColor = result.mainBoxColor
    ? convertArgbToRgba(result.mainBoxColor)
    : DEFAULT_UI_CUSTOMIZATION.mainBoxColor;

  // Get the name of the file from the url
  ui.hasLogo = result.logoUrl !== "";
  ui.logoUrl = result.logoUrl;
  ui.logoSize = result.logoSize || DEFAULT_UI_CUSTOMIZATION.logoSize;

  policyData.uiCustomization = ui;
  return policyData;
};

export const parsePolicyData = async (data) => {
  let policyData = JSON.parse(data);

  policyData = await setPermissionsSettings(policyData);
  policyData = setConfigurationSettings(policyData);
  policyData = setCustomizationSettings(policyData);

  return policyData;
};
