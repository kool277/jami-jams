import React from "react";
import PropTypes from "prop-types";

import MuiAlert from "@mui/lab/Alert";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";

// https://stackoverflow.com/a/67961603
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SlideTransition = React.forwardRef(function SlideTransition(props, ref) {
  return <Slide ref={ref} {...props} direction="left" />;
});

export default function BlueprintSnackbar({ snackbar, setSnackbar }) {
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
}

BlueprintSnackbar.propTypes = {
  snackbar: PropTypes.object,
  setSnackbar: PropTypes.func,
};
