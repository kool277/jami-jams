import React, { useState } from "react";

import Checkbox from "@material-ui/core/Checkbox";
import { SketchPicker } from "react-color";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { TextField, makeStyles } from "@material-ui/core";

import Typography from "@material-ui/core/Typography";
import CustomImgDropZone from "components/CustomImgDropZone/CustomImgDropZone";

import i18next from "i18next";

const styles = {
  colorButtonStyle: {
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    border: "1px solid grey",
    outline: "none",
    cursor: "pointer",
  },
  popover: {
    position: "absolute",
    zIndex: "2",
  },
  cover: {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  },
};

const useStyles = makeStyles(styles);

const IsCustomizationEnabledForm = ({
  isCustomizationEnabled,
  handleUpdateUi,
}) => {
  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Checkbox
            checked={isCustomizationEnabled}
            color="primary"
            onChange={(e) => {
              handleUpdateUi("isCustomizationEnabled", e.target.checked);
            }}
            name="isCustomizationEnabled"
          />
        }
        label={i18next.t("is_customization_enabled", "Enable customization")}
      />
    </FormGroup>
  );
};

const HasTitleForm = ({ uiCustomization, handleUpdateUi }) => {
  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Checkbox
            checked={uiCustomization.hasTitle}
            color="primary"
            onChange={(e) => {
              handleUpdateUi("hasTitle", e.target.checked);
            }}
            name="hasTitle"
          />
        }
        label={i18next.t("welcome_has_title", "Title")}
      />
    </FormGroup>
  );
};

const TitleForm = ({ uiCustomization, handleUpdateUi }) => {
  if (!uiCustomization.hasTitle) {
    return null;
  }

  return (
    <FormGroup row>
      <span>
        {i18next.t(
          "instruction_title",
          "Use Jami title or personalize it (max 20 characters)"
        )}
      </span>
      <TextField
        id="customTitle"
        placeholder={i18next.t("welcome_title", "Welcome to Jami")}
        value={uiCustomization.customTitle}
        onChange={(e) => {
          handleUpdateUi("customTitle", e.target.value);
        }}
        fullWidth
        inputProps={{ maxLength: 20 }}
      />
    </FormGroup>
  );
};

const HasDescriptionForm = ({ uiCustomization, handleUpdateUi }) => {
  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Checkbox
            checked={uiCustomization.hasDescription}
            color="primary"
            name="hasDescription"
            onChange={(e) => {
              handleUpdateUi("hasDescription", e.target.checked);
            }}
          />
        }
        label={i18next.t("welcome_has_description", "Description")}
      />
    </FormGroup>
  );
};

const DescriptionForm = ({ uiCustomization, handleUpdateUi }) => {
  return (
    <FormGroup row>
      {uiCustomization.hasDescription && (
        <>
          <span>
            {i18next.t(
              "instruction_description",
              "Use Jami description or personalize it (max 100 characters)"
            )}
          </span>
          <TextField
            id="customDescription"
            placeholder={i18next.t(
              "welcome_Description",
              "Here is your Jami identifier, don’t hesitate to share it in order to be contacted more easily!"
            )}
            value={uiCustomization.customDescription}
            onChange={(e) => {
              handleUpdateUi("customDescription", e.target.value);
            }}
            fullWidth
            inputProps={{ maxLength: 100 }}
          />
        </>
      )}
    </FormGroup>
  );
};

const HasTipsForm = ({ uiCustomization, handleUpdateUi }) => {
  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Checkbox
            checked={uiCustomization.hasTips}
            color="primary"
            onChange={(e) => {
              handleUpdateUi("hasTips", e.target.checked);
            }}
            name="hasTips"
          />
        }
        label={i18next.t("welcome_has_Tips", "Tips")}
      />
    </FormGroup>
  );
};

const HasBackgroundCustomForm = ({ uiCustomization, handleUpdateUi }) => {
  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Checkbox
            checked={uiCustomization.hasBackgroundCustom}
            color="primary"
            onChange={(e) => {
              handleUpdateUi("hasBackgroundCustom", e.target.checked);
            }}
            name="hasBackgroundCustom"
          />
        }
        label={i18next.t("welcome_has_BackgroundCustom", "Background")}
      />
    </FormGroup>
  );
};

const CustomBackgroundForm = ({
  uiCustomization,
  handleColorChange,
  handleUpdateUi,
  handleImgDrop,
  bgFile,
}) => {
  const classes = useStyles();

  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClickColor = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const setBgFile = (value) => {
    handleUpdateUi("bgFile", value);
  };

  const handleCloseColor = () => {
    setDisplayColorPicker(false);
  };

  return (
    <FormGroup row>
      {uiCustomization.hasBackgroundCustom && (
        <>
          <span>
            {i18next.t(
              "instruction_background",
              "Choose a background color or a background image"
            )}
          </span>
          <FormGroup
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
              flexDirection: "row",
              padding: "10px 0",
            }}
          >
            <div style={{ padding: "0 20px" }}>
              <button
                style={{
                  backgroundColor: uiCustomization.customBackgroundColor,
                }}
                className={classes.colorButtonStyle}
                onClick={() => {
                  handleClickColor();
                }}
              />
              {displayColorPicker && (
                <div className={classes.popover}>
                  <div className={classes.cover} onClick={handleCloseColor} />
                  <SketchPicker
                    color={uiCustomization.customBackgroundColor}
                    onChange={(color) => {
                      handleColorChange(color);
                      handleUpdateUi("customBackgroundColor", color.hex);
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ padding: "0 20px" }}>
              <Typography>{i18next.t("or", "or")}</Typography>
            </div>

            <div style={{ padding: "0 20px" }}>
              <CustomImgDropZone
                onDrop={(files) => {
                  handleImgDrop(files, "background");
                }}
                label={i18next.t("upload_an_image", "UPLOAD AN IMAGE")}
                file={bgFile}
                setFile={setBgFile}
                handleDelete={(e) => {
                  handleUpdateUi("customBackgroundImageUrl", "");
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
            </div>
          </FormGroup>
        </>
      )}
    </FormGroup>
  );
};

const HasLogoForm = ({ uiCustomization, handleUpdateUi }) => {
  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Checkbox
            checked={uiCustomization.hasLogo}
            color="primary"
            onChange={(e) => {
              handleUpdateUi("hasLogo", e.target.checked);
            }}
            name="hasLogo"
          />
        }
        label={i18next.t("welcome_has_Logo", "Logotype")}
      />
    </FormGroup>
  );
};

const LogoForm = ({
  handleImgDrop,
  handleDeleteLogo,
  handleUpdateUi,
  logoFile,
}) => {
  const setLogoFile = (value) => {
    handleUpdateUi("logoFile", value);
  };

  return (
    <>
      <span>
        {i18next.t(
          "instruction_logo",
          "Use Jami logotype or upload a logotype"
        )}
      </span>

      <FormGroup row style={{ padding: "10px 0" }}>
        <CustomImgDropZone
          onDrop={(files) => handleImgDrop(files, "logo")}
          label={i18next.t("upload_a_logotype", "UPLOAD A LOGOTYPE")}
          file={logoFile}
          setFile={setLogoFile}
          handleDelete={(e) => {
            handleDeleteLogo(e);
            handleUpdateUi("customLogoImageUrl", null);
          }}
        />
      </FormGroup>
    </>
  );
};

const EditBlueprintUiForm = ({
  uiCustomization,
  setUiCustomization,
  handleUpdateUi,
  handleImgDrop,
}) => {
  const { isCustomizationEnabled } = uiCustomization;

  const bgFile = uiCustomization.customBackgroundImageUrl?.split("/").pop();
  const logoFile = uiCustomization.customLogoImageUrl?.split("/").pop();

  const handleDeleteLogo = (e) => {
    setUiCustomization({
      ...uiCustomization,
      customLogoImageUrl: "",
    });
    e.stopPropagation();
  };

  const handleColorChange = (color) => {
    setUiCustomization({
      ...uiCustomization,
      customBackgroundColor: color.hex,
      customBackgroundImageUrl: "",
    });
  };

  return (
    <>
      <IsCustomizationEnabledForm
        isCustomizationEnabled={isCustomizationEnabled}
        handleUpdateUi={handleUpdateUi}
      />

      {isCustomizationEnabled && (
        <>
          <HasTitleForm
            uiCustomization={uiCustomization}
            handleUpdateUi={handleUpdateUi}
          />
          <TitleForm
            uiCustomization={uiCustomization}
            handleUpdateUi={handleUpdateUi}
          />
          <HasDescriptionForm
            uiCustomization={uiCustomization}
            handleUpdateUi={handleUpdateUi}
          />
          <DescriptionForm
            uiCustomization={uiCustomization}
            handleUpdateUi={handleUpdateUi}
          />
          <HasTipsForm
            uiCustomization={uiCustomization}
            handleUpdateUi={handleUpdateUi}
          />

          <HasBackgroundCustomForm
            uiCustomization={uiCustomization}
            handleUpdateUi={handleUpdateUi}
          />
          <CustomBackgroundForm
            uiCustomization={uiCustomization}
            handleColorChange={handleColorChange}
            handleUpdateUi={handleUpdateUi}
            handleImgDrop={handleImgDrop}
            bgFile={bgFile}
          />
          <HasLogoForm
            uiCustomization={uiCustomization}
            handleUpdateUi={handleUpdateUi}
          />
          {uiCustomization.hasLogo && (
            <LogoForm
              handleImgDrop={handleImgDrop}
              handleDeleteLogo={handleDeleteLogo}
              handleUpdateUi={handleUpdateUi}
              logoFile={logoFile}
            />
          )}
        </>
      )}
    </>
  );
};

export default EditBlueprintUiForm;
