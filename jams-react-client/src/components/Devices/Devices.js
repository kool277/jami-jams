import React, {useEffect} from "react";
import classnames from "classnames";
import {Formik, Field} from "formik";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Button from "components/CustomButtons/Button.js";
import Table from "@material-ui/core/Table";
import TableHead from '@material-ui/core/TableHead';
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
// core components
import styles from "assets/jss/material-dashboard-react/components/devicesStyle.js";
import auth from "auth.js"
import configApiCall from "api.js";
import {
    api_path_delete_admin_device_revoke, api_path_delete_auth_device_revoke,
    api_path_get_admin_devices,
    api_path_get_auth_devices, api_path_rename_device
} from "../../globalUrls";
import axios from "axios";

const useStyles = makeStyles(styles);

export default function Devices(props) {
    const classes = useStyles();
    const [devices, setDevices] = React.useState([])
    const [selectedDevice, setSelectedDevice]= React.useState({});
    const [displayName, setDisplayName] = React.useState("")
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openRevoke, setOpenRevoke] = React.useState(false);
    const  userData = {
        "username":props.username
    };

    useEffect(() => {
        auth.checkDirectoryType(() => {
            if(auth.hasAdminScope()){
                axios(configApiCall(api_path_get_admin_devices, 'GET', userData, null)).then((response)=>{
                    var resultSet = JSON.parse(response.data.replace(/\s+/g, ' ').trim());
                    setDevices(resultSet)
                }).catch((error) =>{
                    console.log(error);
                });
            }
            else{
                axios(configApiCall(api_path_get_auth_devices, 'GET', null, null)).then((response)=>{
                    var resultSet = JSON.parse(response.data.replace(/\s+/g, ' ').trim());
                    setDevices(resultSet)
                }).catch((error) =>{
                    console.log(error);
                });
            }
        })
    }, [selectedDevice]);

    function getDeviceStatus(device) {
        if (!(device.revoked)) {
            return 'Active';
        }
        else {
            return 'Revoked';

        }
    }

    const handleClickEdit = (e, device) => {
        e.preventDefault();
        setOpenEdit(true);
        setSelectedDevice(device);
    }

    const handleClickRevoke = (e, device) => {
        e.preventDefault();
        setOpenRevoke(true);
        setSelectedDevice(device);
    }

    const handleClose = () => {
        setOpenEdit(false);
        setOpenRevoke(false);
        setSelectedDevice({});
    }
    const handleCancel = () => {
        setOpenEdit(false);
        setOpenRevoke(false);
        setSelectedDevice({});
    }

    const handleUpdate = () => {
        if(auth.hasAdminScope()){
            const data = {
                username: props.username,
                deviceId: selectedDevice.deviceId,
                deviceName: displayName
            }
            axios(configApiCall(api_path_delete_admin_device_revoke+"?username="+ data.username+"&deviceId="+data.deviceId+"&deviceName="+data.deviceName, 'PUT', null, null)).then((response)=>{
                    setSelectedDevice({});
                    setOpenEdit(false);
                }
            ).catch((error) =>{
                console.log(error);
            });
        }
        else{
            const data = {
                deviceName: displayName
            }
            axios(configApiCall(api_path_rename_device+"/"+selectedDevice.deviceId+ "?deviceName="+ data.deviceName, 'PUT', null, null)).then((response)=>{
                    setSelectedDevice({});
                    setOpenEdit(false);
                }
            ).catch((error) =>{
                console.log(error);
            });
        }
    }

    const handleDeviceRevoke = () => {
        if(auth.hasAdminScope()){
            const data = {
                username: props.username,
                deviceId: selectedDevice.deviceId,
            }
            axios(configApiCall(api_path_delete_admin_device_revoke+"?username="+ data.username+"&deviceId="+data.deviceId, 'DELETE', null, null)).then((response)=>{
                    setSelectedDevice({});
                    setOpenRevoke(false);
                }
            ).catch((error) =>{
                console.log(error);
            });
        }
        else{

            axios(configApiCall(api_path_delete_auth_device_revoke+"/"+selectedDevice.deviceId, 'DELETE', null, null)).then((response)=>{
                    setSelectedDevice({});
                    setOpenRevoke(false);
                }
            ).catch((error) =>{
                console.log(error);
            });
        }
    }

    /**
     * Formik Validation
     */
    const validateDisplayName = displaynamevalue => {
        let error;
        if (!displaynamevalue) {
            error = 'Required';
        }
        return error;
    }

    const tableCellClasses = classnames(classes.tableCell);
    return (
        <div>
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
                                        onClick={e =>handleClickEdit(e, device)}
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
                                        onClick={e => handleClickRevoke(e,device)}
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
            <Dialog open={openEdit} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-edit-dialog-title">Update Device Information</DialogTitle>
                <Formik initialValues={{
                    displayName: '',
                }}
                >
                    {({ errors, touched, validateField}) => (
                        <form>
                            <DialogContent>
                                <Field name="displayName" validate={validateDisplayName} >
                                    {({field}) => (
                                        <div>
                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                id="name"
                                                label="Device Display Name"
                                                fullWidth
                                                onChange={setDisplayName(field.value)}
                                                helperText={(errors.displayName && touched.displayName) && errors.displayName}
                                                {...field}
                                            />
                                        </div>
                                    )
                                    }
                                </Field>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCancel} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={() => validateField('displayName').then(() =>handleUpdate())} color="primary">
                                    Update
                                </Button>
                            </DialogActions>
                        </form>
                    )}
                </Formik>
            </Dialog>
            <Dialog open={openRevoke} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-revoke-dialog-title">Revoke Device</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to revoke this device?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeviceRevoke} color="primary">
                        Confirm Revoke
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

