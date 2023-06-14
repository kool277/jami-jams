import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import SettingsIcon from "@material-ui/icons/Settings";

import { hexToRgb, blackColor } from "assets/jss/material-dashboard-react.js";

import axios from "axios";
import configApiCall from "../../api";
import {
  api_path_blueprints,
  api_path_get_image,
  api_path_post_image,
} from "../../globalUrls";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import i18next from "i18next";

const DEFAULT_UI_CUSTOMIZATION = {
  hasTitle: true,
  customTitle: "",
  hasDescription: true,
  customDescription: "",
  hasTips: false,
  hasBackgroundCustom: false,
  customBackgroundColor: "",
  customBackgroundImageUrl: "",
  hasLogo: true,
  customLogoImageUrl: "",
};

const styles = {
  ...dashboardStyle,
  card: {
    minWidth: "500px",
  },
  cardBody: {
    flexGrow: 1,
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  input: {
    display: "none",
  },
  profileAsBackground: {
    backgroundSize: "100% 100%",
    width: "80px",
    height: "80px",
  },
  centerIconMiddle: {
    position: "relative",
    top: "20px",
    left: "15px",
  },
  editProfilePicture: {
    borderRadius: "50%",
    width: "200px",
    height: "200px",
    boxShadow:
      "0 6px 8px -12px rgba(" +
      hexToRgb(blackColor) +
      ", 0.56), 0 4px 25px 0px rgba(" +
      hexToRgb(blackColor) +
      ", 0.12), 0 8px 10px -5px rgba(" +
      hexToRgb(blackColor) +
      ", 0.2)",
  },
  dialogPaper: {
    minHeight: "60vh",
    maxHeight: "60vh",
    minWidth: "80vh",
    maxWidth: "80vh",
  },
  uploadIconStyle: {
    fontSize: "35px",
    marginBottom: "10px",
    marginRight: "10px",
  },
};

const useStyles = makeStyles(styles);

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function EditBlueprintUi({ blueprintName }) {
  const classes = useStyles();

  const [policyData, setPolicyData] = useState({
    uiCustomization: DEFAULT_UI_CUSTOMIZATION,
  });
  let { uiCustomization } = policyData;

  const setUiCustomization = (ui) => {
    setPolicyData({ ...policyData, uiCustomization: ui });
  };

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(false);
  const [severity, setSeverity] = useState("success");

  const [bgFile, setBgFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

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
        let policyDataResponse = JSON.parse(response.data.policyData);
        policyDataResponse.uiCustomization = JSON.parse(
          policyDataResponse.uiCustomization
        );

        setPolicyData(policyDataResponse);

        const { uiCustomization: uiCustomizationResponse } = policyDataResponse;

        if (uiCustomizationResponse) {
          if (
            uiCustomizationResponse.customBackgroundImageUrl &&
            uiCustomizationResponse.hasBackgroundCustom
          ) {
            //Get the name of the file from the url
            let urlParts = uiCustomizationResponse.customBackgroundImageUrl.split(
              "/"
            );
            if (urlParts.length) {
              setBgFile(urlParts[urlParts.length - 1]);
            }
          }
          if (
            uiCustomizationResponse.customLogoImageUrl &&
            uiCustomizationResponse.hasLogo
          ) {
            //Get the name of the file from the url
            let urlParts = uiCustomizationResponse.customLogoImageUrl.split(
              "/"
            );
            if (urlParts.length) {
              setLogoFile(urlParts[urlParts.length - 1]);
            }
          }

          console.log("Found ui customization in the policy data");
        } else {
          setUiCustomization(DEFAULT_UI_CUSTOMIZATION);
          console.log("Did not find ui customization in the policy data");
        }
      })
      .catch((error) => {
        setUiCustomization(DEFAULT_UI_CUSTOMIZATION);

        console.log(
          `Error fetching blueprint permissions : ${blueprintName} ${error}`
        );
      });
  }, [blueprintName]);

  const handleUpdateUi = (field, value) => {
    const newUiCustomization = { ...uiCustomization, [field]: value };

    axios(
      configApiCall(
        api_path_blueprints + "?name=" + blueprintName,
        "PUT",
        { ...policyData, uiCustomization: JSON.stringify(newUiCustomization) },
        null
      )
    )
      .then(() => {
        setOpen(false);
        setSeverity("success");
        setOpen(true);
        setMessage(
          i18next.t(
            "updated_blueprint_permissions_successfully",
            "Blueprint permissions successfully updated."
          )
        );
      })
      .catch((error) => {
        console.error(error);
        setOpen(false);
        setSeverity("error");
        setOpen(true);
        setMessage(
          i18next.t(
            "error_updating_blueprint_permissions",
            "Error occurred while updating blueprint permissions."
          ) +
            error +
            "!"
        );
      });
  };

  const handleImgDrop = (acceptedFiles, imgType) => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);

    const url = `${api_path_post_image}/${blueprintName}/${imgType}`;

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then(() => {
        if (imgType === "background") {
          let newUrl =
            api_path_get_image +
            "/" +
            blueprintName +
            "/background/" +
            acceptedFiles[0].name;
          setUiCustomization({
            ...uiCustomization,
            backgroundUrl: newUrl,
            backgroundColor: "",
          });
          setBgFile(acceptedFiles[0].name);
          handleUpdateUi("backgroundUrl", newUrl);
        } else if (imgType === "logo") {
          let newUrl =
            api_path_get_image +
            "/" +
            blueprintName +
            "/logo/" +
            acceptedFiles[0].name;
          setUiCustomization({
            ...uiCustomization,
            logoUrl: newUrl,
          });
          setLogoFile(acceptedFiles[0].name);
          handleUpdateUi("logoUrl", newUrl);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeleteLogo = (e) => {
    setLogoFile(null);
    setUiCustomization({
      ...uiCustomization,
      customLogoImageUrl: null,
    });
    e.stopPropagation();
  };

  const handleDeleteBg = (e) => {
    setBgFile(null);
    setUiCustomization({
      ...uiCustomization,
      customBackgroundImageUrl: null,
    });
    e.preventDefault();
    e.stopPropagation();
  };

  const handleColorChange = (color) => {
    setUiCustomization({
      ...uiCustomization,
      customBackgroundColor: color.hex,
      customBackgroundImageUrl: null,
    });
    setBgFile(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        onClose={handleClose}
        message={message}
        key={"bottomright"}
      >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>

      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card profile className={classes.card}>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <SettingsIcon />
              </CardIcon>
              <p className={classes.cardCategory}>
                {i18next.t("customization", "Customization")}
              </p>
              <h3 className={classes.cardTitle}>{blueprintName}</h3>
            </CardHeader>
            <CardBody profile>
              <div className={classes.cardBody}>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={12} md={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12} md={12}>
                        <EditBlueprintUiForm
                          uiCustomization={policyData.uiCustomization}
                          setUiCustomization={setUiCustomization}
                          handleUpdateUi={handleUpdateUi}
                          handleImgDrop={handleImgDrop}
                          logoFile={logoFile}
                          setLogoFile={setLogoFile}
                          handleDeleteLogo={handleDeleteLogo}
                          bgFile={bgFile}
                          setBgFile={setBgFile}
                          handleDeleteBg={handleDeleteBg}
                          handleColorChange={handleColorChange}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
