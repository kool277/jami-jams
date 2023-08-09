import React, { Dispatch, FC, SetStateAction } from "react";

import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import { SnackbarProps } from "views/Blueprint/PolicyDataContext";

// https://stackoverflow.com/a/67961603
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SlideTransition = React.forwardRef(function SlideTransition(props, ref) {
  return <Slide ref={ref} {...props} direction="left" />;
});

interface BlueprintSnackbarProps {
  snackbar: SnackbarProps;
  setSnackbar: Dispatch<SetStateAction<SnackbarProps>>;
}

export const BlueprintSnackbar: FC<BlueprintSnackbarProps> = ({
  snackbar,
  setSnackbar,
}) => {
  const snackbarRef = React.createRef(null);

  const handleClose = () => {
    setSnackbar((state) => ({ ...state, open: false }));
  };

  return (
    <Snackbar
      ref={snackbarRef}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={snackbar.open}
      onClose={handleClose}
      message={snackbar.message}
      key={"bottomright"}
    >
      <Alert onClose={handleClose} severity={snackbar.severity}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};
