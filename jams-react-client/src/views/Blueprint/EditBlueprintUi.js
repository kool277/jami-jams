import React, { useContext, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import SettingsIcon from "@material-ui/icons/Settings";

import BlueprintSnackbar from "components/Snackbar/BlueprintSnackbar";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import { hexToRgb, blackColor } from "assets/jss/material-dashboard-react.js";

import { api_path_get_image, api_path_post_image } from "../../globalUrls";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

import i18next from "i18next";

import CustomUiPreview from "components/CustomUiPreview/CustomUiPreview";
import EditBlueprintUiForm from "./EditBlueprintUiForm";
import { DEFAULT_UI_CUSTOMIZATION } from "./policyData.constants";
import { PolicyDataContext } from "./PolicyDataContext";

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

export default function EditBlueprintUi({ blueprintName }) {
  const classes = useStyles();

  const { policyData, updatePolicyData, snackbar, setSnackbar } = useContext(
    PolicyDataContext
  );
  const { uiCustomization } = policyData;

  const setUiCustomization = (ui) => {
    updatePolicyData("uiCustomization", ui);
  };

  const [oldUiCustomization, setOldUiCustomization] = useState(uiCustomization);
  const [opacity, setOpacity] = useState(0);

  const handleUpdateUi = (field, value) => {
    const newUiCustomization = { ...uiCustomization, [field]: value };
    const newUi = newUiCustomization.isCustomizationEnabled
      ? newUiCustomization
      : DEFAULT_UI_CUSTOMIZATION;

    if (
      field === "title" ||
      field === "description" ||
      field === "backgroundColor"
    ) {
      // Don't fade in for those fields
      setOldUiCustomization(newUiCustomization);
    } else {
      // To make a fade effect, the new preview fades in,
      // then the old preview is updated, and the preview on top fades out
      setOpacity(1);
      setTimeout(() => {
        setOldUiCustomization(newUi);
        setOpacity(0);
      }, 250);
    }

    updatePolicyData("uiCustomization", newUiCustomization);
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
          handleUpdateUi("logoUrl", newUrl);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <BlueprintSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
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
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        className={classes.previewContainer}
                      >
                        <CustomUiPreview
                          opacity={opacity}
                          uiCustomization={uiCustomization}
                        />
                        <CustomUiPreview
                          isOldPreview
                          opacity="1"
                          uiCustomization={oldUiCustomization}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12}>
                        <EditBlueprintUiForm
                          uiCustomization={uiCustomization}
                          setUiCustomization={setUiCustomization}
                          handleUpdateUi={handleUpdateUi}
                          handleImgDrop={handleImgDrop}
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
