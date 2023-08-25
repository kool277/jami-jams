import { useState } from "react";
import { makeStyles } from "@mui/styles";
import { HexAlphaColorPicker, HexColorPicker } from "react-colorful";

const styles = {
  root: {
    position: "relative",
    padding: "0 20px",
  },
  colorButtonStyle: {
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    border: "1px solid grey",
    outline: "none",
    cursor: "pointer",
  },
  popover: {
    position: "absolute",
    left: "60px",
    bottom: 0,
    zIndex: "2",
  },
  cover: {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
    backgroundColor: "#00000040",
  },
};

const useStyles = makeStyles(styles);

export default function ColorPickerPopup({ hasAlphaChannel, color, onChange }) {
  const classes = useStyles();

  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClickColor = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleCloseColor = () => {
    setDisplayColorPicker(false);
  };

  return (
    <div className={classes.root}>
      <button
        style={{
          backgroundColor: color,
        }}
        className={classes.colorButtonStyle}
        onClick={() => {
          handleClickColor();
        }}
      />
      {displayColorPicker && (
        <div className={classes.popover}>
          <div className={classes.cover} onClick={handleCloseColor} />
          {hasAlphaChannel ? (
            <HexAlphaColorPicker color={color} onChange={onChange} />
          ) : (
            <HexColorPicker color={color} onChange={onChange} />
          )}
        </div>
      )}
    </div>
  );
}
