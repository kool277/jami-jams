import { FC } from "react";
import { makeStyles } from "@mui/styles";

import tipLightBulbImage from "assets/img/tip_light_bulb.svg";
import { luma } from "./luma";

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
    color: (props) => props.fontColor,
  },
  text: {
    fontSize: "6px",
    margin: 0,
    color: (props) => props.fontColor,
  },
};

const useStyles = makeStyles(styles);

interface TipBoxProps {
  color: string;
  text: string;
}

export const TipBox: FC<TipBoxProps> = ({ color, text }) => {
  const fontColor = luma(color) ? "#ffffff" : "#000000";

  const classes = useStyles({ color, fontColor });

  return (
    <div className={classes.root}>
      <img src={tipLightBulbImage} alt="light bulb" className={classes.img} />
      <span className={classes.title}>Tips</span>
      <p className={classes.text}>{text}</p>
    </div>
  );
};
