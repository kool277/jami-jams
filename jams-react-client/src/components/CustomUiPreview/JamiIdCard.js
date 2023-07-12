import React from "react";

import { makeStyles } from "@mui/styles";

import jamiIdImage from "assets/img/jami_id.svg";
import copySvg from "assets/img/BTN_Copy.svg";
import shareSvg from "assets/img/BTN_Share.svg";
import { infoColor } from "assets/jss/material-dashboard-react";

const styles = {
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: "150px",
    height: "20px",
    borderRadius: "5px",
  },
  main: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    width: "100px",
    height: "100%",
    borderRadius: "5px 0px 0px 5px",
    backgroundColor: (props) => props.color,
  },
  logo: {
    marginLeft: "5px",
    height: "12px",
  },
  nameplate: {
    flex: 2,
    textAlign: "center",
    fontSize: "12px",
    color: infoColor[0],
  },
  icons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "6px",
    padding: "0px 6px 0px 6px",
    height: "100%",
    marginLeft: "1px",
    borderRadius: "0px 5px 5px 0px",
    backgroundColor: (props) => props.color,
  },
  icon: {
    width: "6px",
    height: "6px",
  },
};

const useStyles = makeStyles(styles);

export default function JamiIdCard({ color, isCompactDisplay }) {
  const classes = useStyles({ color, isCompactDisplay });

  return (
    <div className={classes.root}>
      <div className={classes.main}>
        <img className={classes.logo} src={jamiIdImage} alt="jami id" />
        <div className={classes.nameplate}>placeholder</div>
      </div>
      <div className={classes.icons}>
        <img src={copySvg} alt="copy" className={classes.icon} />
        <img src={shareSvg} alt="share" className={classes.icon} />
      </div>
    </div>
  );
}
