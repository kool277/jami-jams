import {
  forwardRef,
  createRef,
  Dispatch,
  FC,
  SetStateAction,
  ForwardedRef,
} from "react";

import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Slide, { SlideProps } from "@mui/material/Slide";
import { SnackbarProps } from "views/Blueprint/PolicyDataContext";

// https://stackoverflow.com/a/67961603
const Alert = forwardRef(function Alert(
  props: any,
  ref: ForwardedRef<HTMLDivElement>
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SlideTransition = forwardRef(function SlideTransition(
  props: SlideProps,
  ref
) {
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
  const snackbarRef = createRef();

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
