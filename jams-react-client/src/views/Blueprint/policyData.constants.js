export const DEFAULT_UI_CUSTOMIZATION = {
  isCustomizationEnabled: false,
  hasTitle: true,
  title: "",
  hasDescription: true,
  description: "",
  hasTips: false,

  hasBackground: false,
  backgroundColor: "",
  backgroundUrl: "",

  hasLogo: true,
  logoUrl: "",
};

export const DEFAULT_POLICY_DATA = {
  videoEnabled: true,
  publicInCalls: false,
  autoAnswer: false,
  peerDiscovery: true,
  allowLookup: true,

  rendezVous: false,
  blueprintModerators: [],

  upnpEnabled: true,

  selectedTurnOption: "defaultTurn",
  turnServer: "turn.jami.net",
  turnServerUserName: "ring",
  turnServerPassword: "ring",

  selectedDHTProxyOption: "defaultDHTProxy",
  proxyServer: "dhtproxy.jami.net",
  dhtProxyListUrl: "",

  uiCustomization: DEFAULT_UI_CUSTOMIZATION,
};
