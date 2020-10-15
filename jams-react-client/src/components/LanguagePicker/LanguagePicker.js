import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

import TranslateIcon from "@material-ui/icons/Translate";

import i18next from "i18next";

import { useTranslation } from "react-i18next";

const languages = [
  {
    value: "en",
    label: "English",
  },
  {
    value: "fr",
    label: "Francais",
  },
  {
    value: "es",
    label: "Español",
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
      backgrounColor: "white",
    },
  },
}));

export default function LanguagePicker() {
  const history = useHistory();
  const [language, setLanguage] = React.useState(i18next.language || window.localStorage.i18nextLng || "");

  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleChange = (value) => {
    setLanguage(value);
    changeLanguage(value);
    history.push("/");
  };

  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Button
            variant="contained"
            color="default"
            fullWidth
            {...bindTrigger(popupState)}
          >
            {languages.map((option) => {
              if (option.value === language) {
                return option.label;
              }
            })}
          </Button>
          <Menu {...bindMenu(popupState)}>
            {languages.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                onClick={() => handleChange(option.value)}
              >
                {option.label}
              </MenuItem>
            ))}
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}
