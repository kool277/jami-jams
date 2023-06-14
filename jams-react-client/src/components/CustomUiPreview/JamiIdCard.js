import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import jamiIdImage from "assets/img/jami_id.svg";
import copySvg from "assets/img/BTN_Copy.svg";
import editSvg from "assets/img/BTN_Edit.svg";
import shareSvg from "assets/img/BTN_Share.svg";
import { infoColor } from "assets/jss/material-dashboard-react";

const styles = {
  root: {
    backgroundColor: (props) => (props.isCompactDisplay ? "#f4f4f4" : "white"),
    maxWidth: (props) => (props.isCompactDisplay ? "100%" : "110px"),
    width: (props) => (props.isCompactDisplay ? "100%" : "110px"),
    height: (props) => (props.isCompactDisplay ? "20px" : "40px"),
    position: "relative",
    borderRadius: "9px",
    overflow: "hidden",
    margin: "auto",
  },
  logo: {
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: infoColor[0],
    borderRadius: (props) =>
      props.isCompactDisplay ? "20px" : "20px 20px 20px 0px",
    padding: "0px 5px 0px 5px",
  },
  nameplate: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: (props) =>
      props.isCompactDisplay ? "translate(-50%, -50%)" : "translate(-50%, 50%)",
    textAlign: "center",
    fontSize: "5px",
  },
  icons: {
    position: "absolute",
    right: "0",
    height: "16px",
    top: (props) => (props.isCompactDisplay ? "50%" : "0"),
    transform: (props) =>
      props.isCompactDisplay ? "translate(0%, -50%)" : "none",
    marginRight: "2px",
  },
  icon: {
    margin: "5px",
    width: "6px",
    height: "6px",
  },
};

const useStyles = makeStyles(styles);

export default function JamiIdCard({ isCompactDisplay }) {
  const classes = useStyles({ isCompactDisplay });

  return (
    <div className={classes.root}>
      <div className={classes.logo}>
        <img src={jamiIdImage} alt="jami id" />
      </div>

      <div className={classes.nameplate}>placeholder</div>

      <div className={classes.icons}>
        <img src={editSvg} alt="edit" className={classes.icon} />
        <img src={copySvg} alt="copy" className={classes.icon} />
        <img src={shareSvg} alt="share" className={classes.icon} />
      </div>
    </div>
  );
}
