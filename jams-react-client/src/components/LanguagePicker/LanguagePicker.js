import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

import i18next from "i18next";

import { useTranslation } from "react-i18next";

export default function LanguagePicker(props) {
  const history = useHistory();
  const [language, setLanguage] = React.useState(
    i18next.language || window.localStorage.i18nextLng || "en"
  );
  const [languages, setLanguages] = React.useState([]);

  const { i18n } = useTranslation();

  const handleChange = (value) => {
    setLanguage(value);
    i18n.changeLanguage(value).then(() => {
      history.push(props.navigationTarget);
    });
  };

  useEffect(() => {
    fetch("/available_languages.json")
      .then((res) => res.json())
      .then((result) => {
        const response = result.languages;
        let translates_languages = [{ code: "en", name: "English" }];

        response.forEach((lang) => {
          if (result.stats[lang.code]["translated"]["percentage"] > 0.01) {
            translates_languages.push(lang);
          }
        });

        let exists = false;
        translates_languages.map((option) => {
          if (option.code === language) {
            exists = true;
          }
        });
        if (!exists) {
          setLanguage("en");
          i18n.changeLanguage("en");
        }
        setLanguages(translates_languages);
      });
  }, [language]);

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
              if (option.code === language) {
                return option.name;
              }
            })}
          </Button>
          <Menu {...bindMenu(popupState)}>
            {languages.map((option) => (
              <MenuItem
                key={option.code}
                value={option.code}
                onClick={() => handleChange(option.code)}
              >
                {option.name}
              </MenuItem>
            ))}
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}
