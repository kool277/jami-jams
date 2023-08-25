import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { Formik, Field } from "formik";
import i18next from "i18next";
import React from "react";
import { Dispatch, FC, SetStateAction } from "react";
import { Device } from "./Devices";

interface EditDeviceDialogProps {
  openEdit: boolean;
  handleClose: () => void;
  selectedDevice: Device;
  setDisplayName: Dispatch<SetStateAction<string>>;
  handleUpdate: () => void;
}

const EditDeviceDialog: FC<EditDeviceDialogProps> = ({
  openEdit,
  handleClose,
  selectedDevice,
  setDisplayName,
  handleUpdate,
}) => {
  /**
   * Formik Validation
   */
  const validateDisplayName = (displaynamevalue) => {
    let error;
    if (!displaynamevalue) {
      error = "Required";
    }
    return error;
  };

  return (
    <Dialog
      open={openEdit}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-edit-dialog-title">
        {i18next.t("update_device_information", "Update Device Information")}
      </DialogTitle>
      <Formik
        initialValues={{
          displayName: selectedDevice.displayName,
        }}
      >
        {({ errors, touched, validateField }) => (
          <form>
            <DialogContent>
              <Field name="displayName" validate={validateDisplayName}>
                {({ field }) => (
                  <div>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label={i18next.t(
                        "device_display_name",
                        "Device Display Name"
                      )}
                      fullWidth
                      onChange={setDisplayName(field.value)}
                      helperText={
                        errors.displayName &&
                        touched.displayName &&
                        errors.displayName
                      }
                      {...field}
                    />
                  </div>
                )}
              </Field>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                {i18next.t("cancel", "Cancel")}
              </Button>
              <Button
                onClick={() =>
                  validateField("displayName").then(() => handleUpdate())
                }
                color="primary"
              >
                {i18next.t("update", "Update")}
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default EditDeviceDialog;
