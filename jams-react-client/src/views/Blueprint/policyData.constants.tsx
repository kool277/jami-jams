import { UserProfile } from "views/UserProfile/DisplayUserProfile";

export interface UiCustomization {
  isCustomizationEnabled: boolean;
  hasTitle: boolean;
  title: string;
  hasDescription: boolean;
  description: string;
  hasTips: boolean;

  hasBackground: boolean;
  backgroundColor: string;
  backgroundUrl: string;

  tipBoxAndIdColor: string;
  hasMainBoxColor: boolean;
  mainBoxColor: string;

  hasLogo: boolean;
  logoUrl: string;
  logoSize: number;
}

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

export interface PolicyDataPermissions {
  videoEnabled: boolean;
  publicInCalls: boolean;
  autoAnswer: boolean;
  peerDiscovery: boolean;
  accountDiscovery: boolean;
  accountPublish: boolean;
  allowLookup: boolean;

  rendezVous: boolean;
  blueprintModerators?: UserProfile[];
}

const DEFAULT_POLICY_DATA_PERMISSIONS: PolicyDataPermissions = {
  videoEnabled: true,
  publicInCalls: false,
  autoAnswer: false,
  peerDiscovery: true,
  accountPublish: true,
  accountDiscovery: true,
  allowLookup: true,

  rendezVous: false,
  blueprintModerators: [],
};

export interface PolicyDataNetwork {
  upnpEnabled: boolean;
  selectedTurnOption?: "defaultTurn" | "customTurn" | "disabledTurn";
  turnEnabled?: boolean;
  turnServer?: string;
  turnServerUserName?: string;
  turnServerPassword?: string;
  proxyEnabled?: boolean;
  selectedDHTProxyOption?:
    | "defaultDHTProxy"
    | "customDHTProxy"
    | "disabledDHTProxy";
  proxyServer?: string;
  dhtProxyListUrl?: string;
  defaultModerators?: string;
}

const DEFAULT_POLICY_DATA_CONFIGURATION: PolicyDataNetwork = {
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

export interface PolicyData extends PolicyDataPermissions, PolicyDataNetwork {
  uiCustomization: UiCustomization;
}

export function createDefaultServerPolicyData(): ServerPolicyData {
  return {
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
    uiCustomization: "",
  };
}

export interface ServerPolicyData {
  videoEnabled: boolean;
  publicInCalls: boolean;
  allowCertFromContact: boolean;
  allowCertFromHistory: boolean;
  allowCertFromTrusted: boolean;
  autoAnswer: boolean;
  peerDiscovery: boolean;
  accountDiscovery: boolean;
  accountPublish: boolean;
  rendezVous: boolean;
  defaultModerators: string;
  upnpEnabled: boolean;
  allowLookup: boolean;
  uiCustomization: string | UiCustomization;
  turnEnabled?: boolean;
  turnServer?: string;
  turnServerUserName?: string;
  turnServerPassword?: string;
  proxyEnabled?: boolean;
  dhtProxyListUrl?: string;
  proxyServer?: string;
}
