import React, { FC, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import classnames from "classnames";
// @mui/material components
import { makeStyles } from "@mui/styles";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";

// @mui/icons-material
import Edit from "@mui/icons-material/Edit";
import Close from "@mui/icons-material/Close";
// core components
import styles from "assets/jss/material-dashboard-react/components/devicesStyle";
import auth from "auth";
import configApiCall from "api";
import {
  api_path_delete_admin_device_revoke,
  api_path_delete_auth_device_revoke,
  api_path_get_admin_devices,
  api_path_get_auth_devices,
  api_path_rename_device,
} from "../../globalUrls";
import axios from "axios";

import i18next from "i18next";
import EditDeviceDialog from "./EditDeviceDialog";
import RevokeDeviceDialog from "./RevokeDeviceDialog";

const useStyles = makeStyles(styles as any);

interface DevicesProps {
  username: string;
}

export interface Device {
  deviceId: string;
  displayName: string;
  revoked: boolean;
}

const Devices: FC<DevicesProps> = ({ username }) => {
  const classes = useStyles();
  const history = useHistory();

  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device>({
    deviceId: "",
    displayName: "",
    revoked: false,
  });
  const [displayName, setDisplayName] = useState("");

  const [openEdit, setOpenEdit] = useState(false);
  const [openRevoke, setOpenRevoke] = useState(false);

  useEffect(() => {
    auth.checkDirectoryType(() => {
      const requestConfig = auth.hasAdminScope()
        ? configApiCall(api_path_get_admin_devices, "GET", { username }, null)
        : configApiCall(api_path_get_auth_devices, "GET", null, null);

      axios(requestConfig)
        .then((response) => {
          if (response.data.length === 0) {
            setDevices([]);
          } else {
            setDevices(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 401) {
            auth.authenticated = false;
            history.push("/signin");
          }
        });
    });
  }, []);

  const getDeviceStatus = (device: Device) => {
    return device.revoked ? "Revoked" : "Active";
  };

  const handleClickEdit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    device: Device
  ) => {
    e.preventDefault();
    setOpenEdit(true);
    setSelectedDevice(device);
  };

  const handleClickRevoke = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    device: Device
  ) => {
    e.preventDefault();
    setOpenRevoke(true);
    setSelectedDevice(device);
  };

  const handleClose = () => {
    setOpenEdit(false);
    setOpenRevoke(false);
    setSelectedDevice(undefined);
  };

  const handleUpdate = () => {
    let requestConfig;
    if (auth.hasAdminScope()) {
      requestConfig = configApiCall(
        api_path_delete_admin_device_revoke +
          "?username=" +
          username +
          "&deviceId=" +
          selectedDevice.deviceId +
          "&deviceName=" +
          displayName,
        "PUT",
        null,
        null
      );
    } else {
      requestConfig = configApiCall(
        api_path_rename_device +
          "/" +
          selectedDevice.deviceId +
          "?deviceName=" +
          displayName,
        "PUT",
        null,
        null
      );
    }

    axios(requestConfig)
      .then(() => {
        setSelectedDevice(undefined);
        setOpenEdit(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeviceRevoke = () => {
    let requestConfig;
    if (auth.hasAdminScope()) {
      const url =
        api_path_delete_admin_device_revoke +
        "?username=" +
        username +
        "&deviceId=" +
        selectedDevice.deviceId;
      requestConfig = configApiCall(url, "DELETE", null, null);
    } else {
      requestConfig = configApiCall(
        api_path_delete_auth_device_revoke + "/" + selectedDevice.deviceId,
        "DELETE",
        null,
        null
      );
    }

    axios(requestConfig)
      .then(() => {
        setSelectedDevice(undefined);
        setOpenRevoke(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const tableCellClasses = classnames(classes.tableCell);
  return (
    <div>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>
              {i18next.t("device_name", "Device Name") as string}
            </TableCell>
            <TableCell>
              {i18next.t("device_id", "Device Id") as string}
            </TableCell>
            <TableCell align="right">
              {i18next.t("status", "Status") as string}
            </TableCell>
            <TableCell align="right">
              {i18next.t("actions", "Actions") as string}
            </TableCell>
          </TableRow>
        </TableHead>
        {devices != null && (
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.displayName} className={classes.tableRow}>
                <TableCell className={tableCellClasses}>
                  {device.displayName}
                </TableCell>
                <TableCell className={tableCellClasses}>
                  {device.deviceId}
                </TableCell>
                <TableCell align="right" className={tableCellClasses}>
                  {getDeviceStatus(device)}
                </TableCell>
                {!device.revoked && (
                  <TableCell align="right" className={classes.tableActions}>
                    <Tooltip
                      id="tooltip-top"
                      title="Edit Device"
                      placement="top"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <IconButton
                        aria-label="Edit"
                        className={classes.tableActionButton}
                        onClick={(e) => handleClickEdit(e, device)}
                        size="large"
                      >
                        <Edit
                          className={
                            classes.tableActionButtonIcon + " " + classes.edit
                          }
                        />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      id="tooltip-top-start"
                      title={
                        i18next.t("revoke_device", "Revoke Device") as string
                      }
                      placement="top"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <IconButton
                        aria-label="Close"
                        className={classes.tableActionButton}
                        onClick={(e) => handleClickRevoke(e, device)}
                        size="large"
                      >
                        <Close
                          className={
                            classes.tableActionButtonIcon + " " + classes.close
                          }
                        />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      <EditDeviceDialog
        openEdit={openEdit}
        handleClose={handleClose}
        selectedDevice={selectedDevice}
        setDisplayName={setDisplayName}
        handleUpdate={handleUpdate}
      />
      <RevokeDeviceDialog
        openRevoke={openRevoke}
        handleClose={handleClose}
        handleDeviceRevoke={handleDeviceRevoke}
      />
    </div>
  );
};

export default Devices;
