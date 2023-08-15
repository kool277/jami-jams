export const DEFAULT_UI_CUSTOMIZATION = {
  isCustomizationEnabled: false,
  hasTitle: true,
  title: "",
  hasDescription: true,
  description: "",
  hasTips: true,

  hasBackground: false,
  backgroundColor: "",
  backgroundUrl: "",

  tipBoxAndIdColor: "#ffffffff",
  hasMainBoxColor: false,
  mainBoxColor: "#ffffff80",

  hasLogo: true,
  logoUrl: "",
  logoSize: 100,
};

const DEFAULT_POLICY_DATA_PERMISSIONS = {
  videoEnabled: true,
  publicInCalls: false,
  autoAnswer: false,
  peerDiscovery: true,
  allowLookup: true,

  rendezVous: false,
  blueprintModerators: [],
};

const DEFAULT_POLICY_DATA_CONFIGURATION = {
  upnpEnabled: true,

  selectedTurnOption: "defaultTurn",
  turnServer: "turn.jami.net",
  turnServerUserName: "ring",
  turnServerPassword: "ring",

  selectedDHTProxyOption: "defaultDHTProxy",
  proxyServer: "dhtproxy.jami.net",
  dhtProxyListUrl: "",
};

export const DEFAULT_POLICY_DATA = {
  ...DEFAULT_POLICY_DATA_PERMISSIONS,
  ...DEFAULT_POLICY_DATA_CONFIGURATION,
  uiCustomization: DEFAULT_UI_CUSTOMIZATION,
};

export type UiCustomization = typeof DEFAULT_UI_CUSTOMIZATION;
export type PolicyDataPermissions = typeof DEFAULT_POLICY_DATA_PERMISSIONS;
export type PolicyDataNetwork = typeof DEFAULT_POLICY_DATA_CONFIGURATION;
export interface PolicyData extends PolicyDataPermissions, PolicyDataNetwork {
  uiCustomization: UiCustomization;
}
