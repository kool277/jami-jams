import React from "react";
import { useHistory } from 'react-router-dom';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from "@material-ui/core/InputLabel";
// core components
import Grid from '@material-ui/core/Grid';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Devices from "components/Devices/Devices.js";
import Search from "@material-ui/icons/Search";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Slider from '@material-ui/core/Slider';
import Typography from "@material-ui/core/Typography";

import Snackbar from '@material-ui/core/Snackbar';

import { hexToRgb, blackColor } from "assets/jss/material-dashboard-react.js";


import PriorityHighOutlinedIcon from '@material-ui/icons/PriorityHighOutlined';

import axios from "axios"
import configApiCall from "../../api"
import { api_path_blueprint_permissions } from "../../globalUrls"

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

import MuiAlert from '@material-ui/lab/Alert';

const CONTAINER_HEIGHT = 200

const fileUpload = require('fuctbase64');



const styles = (theme)=> ( {
    ...dashboardStyle,
    root: {
        flexGrow: 1
    },
    cardCategoryWhite: {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    cardTitleWhite: {
      color: "#FFFFFF",
      marginTop: "0px",
      minHeight: "auto",
      fontWeight: "300",
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      marginBottom: "3px",
      textDecoration: "none"
    },
    input: {
        display: 'none',
    },
    profileAsBackground: {
        backgroundSize: "100% 100%",
        width: "80px",
        height: "80px",
    },
    centerIconMiddle: {
        position:"relative",
        top: "20px",
        left: "15px"
    },
    editProfilePicture: {
        borderRadius: "50%",
        width: "200px", 
        height: "200px",
        boxShadow:
        "0 6px 8px -12px rgba(" +
        hexToRgb(blackColor) +
        ", 0.56), 0 4px 25px 0px rgba(" +
        hexToRgb(blackColor) +
        ", 0.12), 0 8px 10px -5px rgba(" +
        hexToRgb(blackColor) +
        ", 0.2)",
    },
    dialogPaper: {
        minHeight: '60vh',
        maxHeight: '60vh',
        minWidth: '80vh',
        maxWidth: '80vh'
    }
  });

const useStyles = makeStyles(styles);

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function EditBlueprintPermissions(props) {
    const classes = useStyles();
    const history = useHistory();

    const [blueprintName, setBlueprintName] = React.useState("")
    const [acceptIncomingCalls, setAcceptIncomingCalls] = React.useState(false)
    const [acceptOutgoingCalls, setAcceptOutgoingCalls] = React.useState(false)
    const [autoAnswer, setAutoAnswer] = React.useState(false)
    const [activateChat, setActivateChat] = React.useState(false)
    const [manageContacts, setManageContacts] = React.useState(false)
    const [restrictAccesParameters, setRestrictAccesParameters] = React.useState(false)
    const [allowNewAccount, setAllowNewAccount] = React.useState(false)
    const [allowConnection, setAllowConnection] = React.useState(false)

    const [open, setOpen] = React.useState(false)
    const [message, setMessage] = React.useState(false)
    const [severity, setSeverity] = React.useState("success")

    React.useEffect(()=>{
        setBlueprintName(props.blueprintName)
        axios(configApiCall(api_path_blueprint_permissions, 'GET', {"queryString": props.blueprintName}, null)).then((response) => {
            response.data.map((blueprint) => {
                setAcceptIncomingCalls(blueprint["acceptIncomingCalls"])
                setAcceptOutgoingCalls(blueprint["acceptOutgoingCalls"])
                setAutoAnswer(blueprint["autoAnswer"])
                setActivateChat(blueprint["activateChat"])
                setManageContacts(blueprint['manageContacts'])
                setRestrictAccesParameters(blueprint["restrictAccesParameters"])
                setAllowNewAccount(blueprint["allowNewAccount"])
                setAllowConnection(blueprint["allowConnection"])
            })
        }).catch((error) => {
            console.log("Error fetching blueprint permissions : " + props.blueprintName + " " + error)
        })
    }, [])

    const handleUpdatePermissions = () => {
        const data = {
            'acceptIncomingCalls': acceptIncomingCalls,
            'acceptOutgoingCalls': acceptOutgoingCalls,
            'autoAnswer': autoAnswer,
            'activateChat': activateChat,
            'manageContacts': manageContacts,
            'restrictAccesParameters': restrictAccesParameters,
            'allowNewAccount': allowNewAccount,
            'allowConnection': allowConnection
        }

        axios(configApiCall(api_path_blueprint_permissions, 'PUT', data, null)).then((response) => {
            setOpen(false)
            setSeverity("success")
            setOpen(true)
            setMessage('Updated blueprint permissions successfully !')
        }).catch((error) => {
            setOpen(false)
            setSeverity("error")
            setOpen(true)
            setMessage('Error updating blueprint permissions ' + error + '!')
        })
    }

    const handleClose = () => {
        setOpen(false)
    }

    return(
        <div>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={open}
                onClose={handleClose}
                message={message}
                key={'bottomright'}
            >
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
            <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                <Card profile>
                    <CardHeader color="info" stats icon>
                        <CardIcon color="info">
                            <PriorityHighOutlinedIcon />
                        </CardIcon>
                        <p className={classes.cardCategory}>Permissions</p>
                        <h3 className={classes.cardTitle}>{props.blueprintName}</h3>
                    </CardHeader>
                    <CardBody profile>
                        <div className={classes.root}>
                        <Grid container spacing={5}>
                            <Grid item xs={12} sm={12} md={6}>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Checkbox checked={acceptIncomingCalls} color="primary" onChange={e => {
                                            setAcceptIncomingCalls(e.target.checked);
                                            handleUpdatePermissions();
                                        }} name="acceptIncomingCalls" />}
                                        label="Accept incoming calls"
                                    />
                                </FormGroup>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Checkbox checked={acceptOutgoingCalls} color="primary" onChange={e => {
                                            setAcceptOutgoingCalls(e.target.checked);
                                            handleUpdatePermissions();
                                        }} name="acceptOutgoingCalls" />}
                                        label="Accept outgoing calls"
                                    />
                                </FormGroup>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Checkbox checked={autoAnswer} color="primary" onChange={e => {
                                            setAutoAnswer(e.target.checked);
                                            handleUpdatePermissions();
                                        }} name="autoAnswer" />}
                                        label="Auto-answer"
                                    />
                                </FormGroup>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Checkbox checked={activateChat} color="primary" onChange={e => {
                                            setActivateChat(e.target.checked);
                                            handleUpdatePermissions();
                                        }} name="activateChat" />}
                                        label="Activate chat"
                                    />
                                </FormGroup>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Checkbox checked={manageContacts} color="primary" onChange={e => {
                                            setManageContacts(e.target.checked);
                                            handleUpdatePermissions();
                                            }} name="manageContacts" />}
                                        label="Manage contacts"
                                    />
                                </FormGroup>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Checkbox checked={restrictAccesParameters} color="primary" onChange={e => {
                                            setRestrictAccesParameters(e.target.checked);
                                            handleUpdatePermissions();
                                        }} name="restrictAccesParameters" />}
                                        label="Restrict acces to parameters with password"
                                    />
                                </FormGroup>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Checkbox checked={allowNewAccount} color="primary" onChange={e => {
                                            setAllowNewAccount(e.target.checked);
                                            handleUpdatePermissions();
                                        }} name="allowNewAccount" />}
                                        label="Allow new account creation"
                                    />
                                </FormGroup>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Checkbox checked={allowConnection} color="primary" onChange={e => {
                                            setAllowConnection(e.target.checked);
                                            handleUpdatePermissions();
                                        }} name="allowConnection" />}
                                        label="Allow connection with other account"
                                    />
                                </FormGroup>
                            </Grid>
                        </Grid>
                        </div>
                    </CardBody>
                </Card>
                </GridItem>
            </GridContainer>
        </div>
    );
}