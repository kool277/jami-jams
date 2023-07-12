import React from "react";
import { makeStyles } from "@mui/styles";

import tipLightBulbImage from "assets/img/tip_light_bulb.svg";

const styles = {
  root: {
    maxWidth: "115px",
    flexBasis: "100%",
    backgroundColor: (props) => props.color,
    padding: "0px 5px 5px 5px",
    borderRadius: "3px",
  },
  img: {
    verticalAlign: "middle",
  },
  title: {
    verticalAlign: "middle",
    fontSize: "8px",
    marginLeft: "0.5rem",
  },
  text: {
    fontSize: "6px",
    margin: 0,
  },
};

const useStyles = makeStyles(styles);

export default function TipBox({ color, text }) {
  const classes = useStyles({ color });

  return (
    <div className={classes.root}>
      <img src={tipLightBulbImage} alt="light bulb" className={classes.img} />
      <span className={classes.title}>Tips</span>
      <p className={classes.text}>{text}</p>
    </div>
  );
}
