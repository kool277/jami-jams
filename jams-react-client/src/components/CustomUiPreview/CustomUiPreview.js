import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import customUiBackgroundImage from "assets/img/CustomUiBg.jpg";
import logoImage from "assets/img/logo-jami-net.svg";

import TipBox from "./TipBox";
import JamiIdCard from "./JamiIdCard";
import i18next from "i18next";

const styles = {
  backgroundImage: {
    backgroundImage: `url(${customUiBackgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "250px",
    position: (props) => (props.isOldPreview ? "relative" : "absolute"),
    left: 0,
    right: 0,
    margin: (props) => (props.isOldPreview ? "0 0" : "0 20px"),
    transition: (props) => (props.isOldPreview ? "none" : "opacity 0.25s"),
    opacity: (props) => props.opacity,
    zIndex: (props) => (props.isOldPreview ? "1" : "2"),
  },
  previewWindow: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "200px",

    borderRadius: "5px",
    backgroundColor: "white",
    display: "flex",
    boxShadow: "0px 3px 6px #0000005C",
  },
  sidebar: {
    // minWidth: "100px",
    width: "100px",
    height: "100%",
    backgroundColor: "#f4f4f4",
    borderRadius: "5px 0px 0px 5px",
  },
  mainContent: {
    flex: 1,
    padding: "2rem",
    backgroundColor: (props) => props.backgroundColor,
    backgroundImage: (props) => `url(${props.backgroundUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "0px 5px 5px 0px",

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  welcomeRow: {
    display: "flex",
    flexDirection: (props) => (props.isCompactDisplay ? "column" : "row"),
    height: "100px",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  logo: {
    width: "50%",
    objectFit: "contain",
    height: "100%",
    marginRight: "1rem",
  },
  welcomeCard: {
    borderRadius: "9px",
    backgroundColor: (props) => (props.isCompactDisplay ? "white" : "#f4f4f4"),
    padding: "10px",
    width: "50%",
  },
  title: {
    margin: 0,
    fontWeight: 500,
  },
  description: {
    fontSize: "5px",
  },
  tipRow: {
    display: "flex",
    justifyContent: "center",
  },
};

const useStyles = makeStyles(styles);

export default function CustomUiPreview({
  isOldPreview,
  opacity,
  uiCustomization,
}) {
  let {
    hasTitle,
    title,
    hasDescription,
    description,
    hasTips,
    hasBackground,
    backgroundColor,
    backgroundUrl,
    hasLogo,
    logoUrl,
  } = uiCustomization;

  if (!title) {
    title = i18next.t("welcome_title", "Welcome to Jami");
  }
  if (!description) {
    description = i18next.t(
      "welcome_Description",
      "Here is your Jami identifier, don’t hesitate to share it in order to be contacted more easily!"
    );
  }
  if (!logoUrl) {
    logoUrl = logoImage;
  }

  if (hasBackground === false) {
    backgroundColor = "white";
    backgroundUrl = "";
  }

  const isCompactDisplay = !hasTitle && !hasDescription && !hasTips;

  const classes = useStyles({
    backgroundColor,
    backgroundUrl,
    isCompactDisplay,
    isOldPreview,
    opacity,
    hasTitle,
  });

  const tip1 = i18next.t(
    "preview_tip1",
    "Add a picture and a nickname to complete your profile"
  );
  const tip2 = i18next.t("preview_tip2", "Why should I save my account?");
  const tip3 = i18next.t("preview_tip3", "How to set shortcuts?");

  return (
    <div className={classes.backgroundImage}>
      <div className={classes.previewWindow}>
        <div className={classes.sidebar}></div>
        <div className={classes.mainContent}>
          <div className={classes.welcomeRow}>
            {hasLogo ? (
              <img src={logoUrl} alt="logo" className={classes.logo}></img>
            ) : null}
            <div className={classes.welcomeCard}>
              {hasTitle ? <h4 className={classes.title}>{title}</h4> : null}
              {hasDescription ? (
                <p className={classes.description}>{description}</p>
              ) : null}
              <JamiIdCard isCompactDisplay={isCompactDisplay} />
            </div>
          </div>
          {hasTips ? (
            <div className={classes.tipRow}>
              <TipBox text={tip1} />
              <TipBox text={tip2} />
              <TipBox text={tip3} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
