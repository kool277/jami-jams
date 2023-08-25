import { FC, ReactNode, createContext, useEffect, useState } from "react";

import axios from "axios";

import configApiCall from "../../api";
import { api_path_blueprints } from "../../globalUrls";
import { parsePolicyData } from "./parsePolicyData";
import { _updatePolicyData } from "./updatePolicyData";
import { DEFAULT_POLICY_DATA, PolicyData } from "./policyData.constants";

export interface SnackbarProps {
  open: boolean;
  severity: "success" | "error";
  message: string;
}

interface PolicyDataProp {
  policyData: PolicyData;
  updatePolicyData: (field: string, value: string) => void;
  snackbar: SnackbarProps;
  setSnackbar: (snackbar: SnackbarProps) => void;
}

export const PolicyDataContext = createContext<PolicyDataProp>(null);

interface Props {
  blueprintName: string;
  children: ReactNode;
}

export const PolicyDataContextProvider: FC<Props> = ({
  blueprintName,
  children,
}) => {
  const [policyData, setPolicyData] = useState(DEFAULT_POLICY_DATA);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    axios(
      configApiCall(
        api_path_blueprints + "?name=" + blueprintName,
        "GET",
        null,
        null
      )
    )
      .then((response) => {
        console.log("GET", response.data.policyData);
        return parsePolicyData(response.data.policyData);
      })
      .then((policyData) => {
        console.log("PARSED", policyData);
        setPolicyData(policyData);
      })
      .catch((error) => {
        console.log("Error fetching blueprint permissions : " + error);
      });
  }, [blueprintName]);

  const updatePolicyData = (field: string, value: string) => {
    _updatePolicyData(
      blueprintName,
      policyData,
      setPolicyData,
      field,
      value,
      setSnackbar
    );
  };

  return (
    <PolicyDataContext.Provider
      value={{ policyData, updatePolicyData, snackbar, setSnackbar }}
    >
      {children}
    </PolicyDataContext.Provider>
  );
};
