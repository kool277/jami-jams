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
import { Dispatch, FC, SetStateAction } from "react";
import * as Yup from "yup";
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
  const validationSchema = Yup.object({
    displayName: Yup.string().required("Required"),
  });

  return (
    <Dialog
      open={openEdit}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-edit-dialog-title">
        {
          i18next.t(
            "update_device_information",
            "Update Device Information"
          ) as string
        }
      </DialogTitle>
      <Formik
        initialValues={{
          displayName: selectedDevice.displayName,
        }}
        onSubmit={handleUpdate}
        validationSchema={validationSchema}
      >
        {({ errors, touched }) => (
          <form>
            <DialogContent>
              <Field name="displayName">
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
                {i18next.t("cancel", "Cancel") as string}
              </Button>
              <Button type="submit" color="primary">
                {i18next.t("update", "Update") as string}
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default EditDeviceDialog;
