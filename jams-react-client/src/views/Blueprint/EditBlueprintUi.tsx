import { useContext, useState } from "react";

import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import SettingsIcon from "@mui/icons-material/Settings";

import { BlueprintSnackbar } from "components/Snackbar/BlueprintSnackbar";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import CardBody from "components/Card/CardBody";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";

import { hexToRgb, blackColor } from "assets/jss/material-dashboard-react";

import { api_path_post_image, url_path, url_port } from "../../globalUrls";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle";

import i18next from "i18next";

import { CustomUiPreview } from "components/CustomUiPreview/CustomUiPreview";
import EditBlueprintUiForm from "./EditBlueprintUiForm";
import {
  DEFAULT_UI_CUSTOMIZATION,
  UiCustomization,
} from "./policyData.constants";
import { PolicyDataContext } from "./PolicyDataContext";

const styles = {
  ...dashboardStyle,
  card: {
    minWidth: "600px",
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

const useStyles = makeStyles(styles as any);

export default function EditBlueprintUi({ blueprintName }) {
  const classes = useStyles();

  const { policyData, updatePolicyData, snackbar, setSnackbar } =
    useContext(PolicyDataContext);
  const { uiCustomization } = policyData;

  const setUiCustomization = (ui) => {
    updatePolicyData("uiCustomization", ui);
  };

  const [oldUiCustomization, setOldUiCustomization] = useState(uiCustomization);
  const [opacity, setOpacity] = useState(0);

  const handleUpdateUi = (field: string | UiCustomization, value?: any) => {
    let newUiCustomization;

    if (typeof field === "object") {
      // If field is an object, it means that the whole uiCustomization object is passed
      newUiCustomization = field;
    } else {
      newUiCustomization = { ...uiCustomization, [field]: value };
    }

    const newUi = newUiCustomization.isCustomizationEnabled
      ? newUiCustomization
      : DEFAULT_UI_CUSTOMIZATION;

    if (
      field === "title" ||
      field === "description" ||
      field === "backgroundColor" ||
      field === "tipBoxAndIdColor" ||
      field === "mainBoxColor" ||
      field === "logoSize"
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

  const handleImgDrop = (acceptedFiles: any[], imgType: string) => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);

    const url = `${url_path}:${url_port}${api_path_post_image}/${blueprintName}/${imgType}`;

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        const newUrl = res.url;

        if (imgType === "background") {
          handleUpdateUi({
            ...uiCustomization,
            backgroundUrl: newUrl,
            backgroundColor: "",
          });
        } else if (imgType === "logo") {
          handleUpdateUi({
            ...uiCustomization,
            logoUrl: newUrl,
          });
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
                {i18next.t("customization", "Customization") as string}
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
                          opacity={1}
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
