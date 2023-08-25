import React, { FC } from "react";
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
        {i18next.t("revoke_device", "Revoke Device")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {i18next.t(
            "are_you_sure_you_want_to_revoke_this_device",
            "Are you sure you want to revoke this device?"
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {i18next.t("cancel", "Cancel")}
        </Button>
        <Button onClick={handleDeviceRevoke} color="primary">
          {i18next.t("confirm_revoke", "Confirm Revoke")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RevokeDeviceDialog;
