import { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

import i18next from "i18next";

import { useTranslation } from "react-i18next";

interface Language {
  code: string;
  name: string;
}

export default function LanguagePicker(props) {
  const history = useHistory();
  const [language, setLanguage] = useState<string>(
    i18next.language || window.localStorage.i18nextLng || "en"
  );
  const [languages, setLanguages] = useState<Language[]>([]);

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
        const response: Language[] = result.data.map(
          ({ attributes }: { attributes: Language }) => attributes
        );
        const translates_languages: Language[] = [
          { code: "en", name: "English" },
          ...response,
        ];

        const exists = translates_languages
          .map((option) => option.code)
          .includes(language);

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
        <Fragment>
          <Button
            variant="contained"
            color="inherit"
            fullWidth
            {...bindTrigger(popupState)}
          >
            {languages.map((option) => {
              if (option.code === language) {
                return option.name;
              }
              return null;
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
        </Fragment>
      )}
    </PopupState>
  );
}
