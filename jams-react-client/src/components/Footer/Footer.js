import React from "react";
// @mui/material components
import { makeStyles } from "@mui/styles";
// core components
import styles from "assets/jss/material-dashboard-react/components/footerStyle.js";

const pjson = require("../../../package.json");

const useStyles = makeStyles(styles);

export default function Footer() {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <p className={classes.right}>
          <span>
            JAMS Version {pjson.version.slice(0, 3)} - &copy;
            {1900 + new Date().getYear()}{" "}
            <a
              href="https://savoirfairelinux.com"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.a}
            >
              Savoir-faire Linux Inc.
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}
