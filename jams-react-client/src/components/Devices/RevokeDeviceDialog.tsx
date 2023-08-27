import { FC } from "react";
import i18next from "i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface RevokeDeviceDialogProps {
  openRevoke: boolean;
  handleClose: () => void;
  handleDeviceRevoke: () => void;
}

const RevokeDeviceDialog: FC<RevokeDeviceDialogProps> = ({
  openRevoke,
  handleClose,
  handleDeviceRevoke,
}) => {
  return (
    <Dialog
      open={openRevoke}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-revoke-dialog-title">
        {i18next.t("revoke_device", "Revoke Device") as string}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {
            i18next.t(
              "are_you_sure_you_want_to_revoke_this_device",
              "Are you sure you want to revoke this device?"
            ) as string
          }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {i18next.t("cancel", "Cancel") as string}
        </Button>
        <Button onClick={handleDeviceRevoke} color="primary">
          {i18next.t("confirm_revoke", "Confirm Revoke") as string}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RevokeDeviceDialog;
