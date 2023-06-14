import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import tipLightBulbImage from "assets/img/tip_light_bulb.svg";

const styles = {
  root: {
    width: "80px",
    maxWidth: "80px",
    flexBasis: "100%",
    backgroundColor: "#f4f4f4",
    padding: "0px 5px 5px 5px",
    margin: "2px",
    borderRadius: "10px",
  },
  img: {
    verticalAlign: "middle",
  },
  title: {
    verticalAlign: "middle",
    fontSize: 6,
    marginLeft: "0.5rem",
  },
  text: {
    fontSize: 5,
    margin: 0,
  },
};

const useStyles = makeStyles(styles);

export default function TipBox({ text }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <img src={tipLightBulbImage} alt="light bulb" className={classes.img} />
      <span className={classes.title}>Tips</span>
      <p className={classes.text}>{text}</p>
    </div>
  );
}
