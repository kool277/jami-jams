import React, {useEffect} from "react";
import classnames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableHead from '@material-ui/core/TableHead';
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
// core components
import styles from "assets/jss/material-dashboard-react/components/devicesStyle.js";
import auth from "auth.js"
import configApiCall from "api.js";
import {api_path_get_admin_devices, api_path_get_auth_devices} from "../../globalUrls";
import axios from "axios";

const useStyles = makeStyles(styles);

export default function Devices(props) {
  const classes = useStyles();
  const [devices, setDevices] = React.useState([])
  const  userData = {
     "username":props.username
  };

    useEffect(() => {
        auth.checkDirectoryType(() => {
            if(auth.hasAdminScope()){
                axios(configApiCall(api_path_get_admin_devices, 'GET', userData, null)).then((response)=>{
                    var resultSet = JSON.parse(response.data.replace(/\s+/g, ' ').trim());
                    setDevices(resultSet)
                    }
                ).catch((error) =>{
                    console.log(error);
                });
            }
            else{
                axios(configApiCall(api_path_get_auth_devices, 'GET', null, null)).then((response)=>{
                        setDevices(response.data)
                    }
                ).catch((error) =>{
                    console.log(error);
                });
            }
        })
    }, []);

  function getDeviceStatus(device) {
      if (!(device.revoked)) {
          return 'Active';
      }
      else {
          return 'Revoked';

      }
  }
  const tableCellClasses = classnames(classes.tableCell);
  return (
    <Table className={classes.table}>
        <TableHead>
            <TableRow>
                <TableCell>Device Name</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Actions</TableCell>
            </TableRow>
        </TableHead>
        {devices != null &&
          <TableBody>
            {devices.map(device =>
              <TableRow key={device.displayName} className={classes.tableRow}>
                <TableCell className={tableCellClasses}>
                    {device.displayName}
                </TableCell>
                <TableCell align="right" className={tableCellClasses}>{getDeviceStatus(device)}</TableCell>
                {!(device.revoked) &&
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
                        title="Desactivate Device"
                        placement="top"
                        classes={{ tooltip: classes.tooltip }}
                      >
                        <IconButton
                          aria-label="Close"
                          className={classes.tableActionButton}
                        >
                          <Close
                            className={
                              classes.tableActionButtonIcon + " " + classes.close
                            }
                          />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                }
              </TableRow>
            )}
          </TableBody>}
    </Table>
  );
}

