import Checkbox from "@mui/material/Checkbox";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Box, Button, Slider, TextField } from "@mui/material";

import Typography from "@mui/material/Typography";
import CustomImgDropZone from "components/CustomImgDropZone/CustomImgDropZone";

import i18next from "i18next";
import ColorPickerPopup from "./ColorPickerPopup";
import { DEFAULT_UI_CUSTOMIZATION } from "./policyData.constants";

const IsCustomizationEnabledForm = ({
  isCustomizationEnabled,
  handleUpdateUi,
}) => {
  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Switch
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
          "Use Jami title or personalize it (max 40 characters)"
        )}
      </span>
      <TextField
        id="title"
        placeholder={i18next.t("welcome_title", "Welcome to Jami")}
        value={uiCustomization.title}
        onChange={(e) => {
          handleUpdateUi("title", e.target.value);
        }}
        fullWidth
        inputProps={{ maxLength: 40 }}
        variant="standard"
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
            id="description"
            placeholder={i18next.t(
              "welcome_Description",
              "Here is your Jami identifier, don't hesitate to share it in order to be contacted more easily!"
            )}
            value={uiCustomization.description}
            onChange={(e) => {
              handleUpdateUi("description", e.target.value);
            }}
            fullWidth
            inputProps={{ maxLength: 100 }}
            variant="standard"
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
        label={i18next.t("welcome_has_Tips", "Enable Tips display")}
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
            checked={uiCustomization.hasBackground}
            color="primary"
            onChange={(e) => {
              handleUpdateUi("hasBackground", e.target.checked);
            }}
            name="hasBackground"
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
  return (
    <>
      <span>
        {i18next.t(
          "instruction_background",
          "Choose a background color or a background image"
        )}
      </span>
      <FormGroup
        row
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
          flexDirection: "row",
          padding: "10px 0",
        }}
      >
        <ColorPickerPopup
          color={uiCustomization.backgroundColor}
          onChange={(color) => {
            handleColorChange(color);
            handleUpdateUi("backgroundColor", color);
          }}
        />

        <div style={{ padding: "0 20px" }}>
          <Typography>{i18next.t("or", "or")}</Typography>
        </div>

        <div style={{ padding: "0 20px" }}>
          <CustomImgDropZone
            onDrop={(files) => {
              handleImgDrop(files, "background");
            }}
            label={i18next
              .t("upload_an_image", "Upload an image")
              .toUpperCase()}
            file={bgFile}
            handleDelete={(e) => {
              handleUpdateUi("backgroundUrl", "");
              e.preventDefault();
              e.stopPropagation();
            }}
          />
        </div>
      </FormGroup>
    </>
  );
};

const TipBoxAndIdColorForm = ({ uiCustomization, handleUpdateUi }) => {
  return (
    <>
      <span>{i18next.t("tip_box_id_color", "Tip Box and Jami ID color")}</span>
      <ColorPickerPopup
        hasAlphaChannel
        color={uiCustomization.tipBoxAndIdColor}
        onChange={(color) => {
          handleUpdateUi("tipBoxAndIdColor", color);
        }}
      />
    </>
  );
};

const MainBoxColorForm = ({ uiCustomization, handleUpdateUi }) => {
  return (
    <>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={uiCustomization.hasMainBoxColor}
              color="primary"
              onChange={(e) => {
                handleUpdateUi("hasMainBoxColor", e.target.checked);
              }}
              name="hasMainBoxColor"
            />
          }
          label={i18next.t(
            "enable_main_box",
            "Add a box behind the title, description and Jami ID"
          )}
        />
      </FormGroup>
      {uiCustomization.hasMainBoxColor && (
        <>
          <span>{i18next.t("main_box_color", "Box color")}</span>
          <ColorPickerPopup
            hasAlphaChannel
            color={uiCustomization.mainBoxColor}
            onChange={(color) => {
              handleUpdateUi("mainBoxColor", color);
            }}
          />
        </>
      )}
    </>
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
          label={i18next
            .t("upload_a_logotype", "Upload a logotype")
            .toUpperCase()}
          file={logoFile}
          handleDelete={(e) => {
            handleDeleteLogo(e);
            handleUpdateUi("logoUrl", null);
          }}
        />
      </FormGroup>
    </>
  );
};

const LogoSizeForm = ({ uiCustomization, handleUpdateUi }) => {
  return (
    <Box sx={{ width: "200px" }}>
      <span>{i18next.t("logo_size", "Size")}</span>
      <Slider
        size="small"
        min={10}
        max={100}
        valueLabelDisplay="auto"
        value={uiCustomization.logoSize}
        onChange={(e, value) => {
          handleUpdateUi("logoSize", value);
        }}
        sx={{ marginLeft: "1rem" }}
      />
    </Box>
  );
};

const EditBlueprintUiForm = ({
  uiCustomization,
  setUiCustomization,
  handleUpdateUi,
  handleImgDrop,
}) => {
  const { isCustomizationEnabled } = uiCustomization;

  const bgFile = uiCustomization.backgroundUrl?.split("/").pop();
  const logoFile = uiCustomization.logoUrl?.split("/").pop();

  const handleDeleteLogo = (e) => {
    setUiCustomization({
      ...uiCustomization,
      logoUrl: "",
    });
    e.stopPropagation();
  };

  const handleColorChange = (color) => {
    setUiCustomization({
      ...uiCustomization,
      backgroundColor: color,
      backgroundUrl: "",
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
          {uiCustomization.hasBackground && (
            <CustomBackgroundForm
              uiCustomization={uiCustomization}
              handleColorChange={handleColorChange}
              handleUpdateUi={handleUpdateUi}
              handleImgDrop={handleImgDrop}
              bgFile={bgFile}
            />
          )}
          <TipBoxAndIdColorForm
            uiCustomization={uiCustomization}
            handleUpdateUi={handleUpdateUi}
          />

          <MainBoxColorForm
            uiCustomization={uiCustomization}
            handleUpdateUi={handleUpdateUi}
          />

          <HasLogoForm
            uiCustomization={uiCustomization}
            handleUpdateUi={handleUpdateUi}
          />
          {uiCustomization.hasLogo && (
            <>
              <LogoForm
                handleImgDrop={handleImgDrop}
                handleDeleteLogo={handleDeleteLogo}
                handleUpdateUi={handleUpdateUi}
                logoFile={logoFile}
              />
              <LogoSizeForm
                uiCustomization={uiCustomization}
                handleUpdateUi={handleUpdateUi}
              />
            </>
          )}

          <Button
            variant="outlined"
            onClick={() => {
              handleUpdateUi({
                ...DEFAULT_UI_CUSTOMIZATION,
                isCustomizationEnabled: true,
              });
            }}
          >
            {i18next.t("default_settings", "Default settings").toUpperCase()}
          </Button>
        </>
      )}
    </>
  );
};

export default EditBlueprintUiForm;
