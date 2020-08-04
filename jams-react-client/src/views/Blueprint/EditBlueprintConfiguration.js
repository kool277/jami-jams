import React, { useCallback } from 'react';
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

import DnsOutlinedIcon from '@material-ui/icons/DnsOutlined';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import StorageOutlinedIcon from '@material-ui/icons/StorageOutlined';
import LanguageOutlinedIcon from '@material-ui/icons/LanguageOutlined';

import { hexToRgb, blackColor } from "assets/jss/material-dashboard-react.js";

import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';

import axios from "axios"
import configApiCall from "../../api"
import { api_path_blueprint_configuration } from "../../globalUrls"

import Snackbar from '@material-ui/core/Snackbar';

import MuiAlert from '@material-ui/lab/Alert';

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

import { debounce } from "lodash";

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

export default function EditBlueprintConfiguration(props) {
    const classes = useStyles();
    const history = useHistory();

    const [blueprintName, setBlueprintName] = React.useState("")
    const [uPnP, setUPnP] = React.useState(true)
    const [turn, setTurn] = React.useState(true)
    const [turnServerAddress, setTurnServerAddress] = React.useState("")
    const [turnUsername, setTurnUsername] = React.useState("")
    const [turnPassword, setTurnPassword] = React.useState("")
    const [bootstrap, setBootstrap] = React.useState(true)
    const [bootstrapName, setBootstrapName] = React.useState("")
    const [dhtProxy, setDhtProxy] = React.useState("")
    const [dhtProxyName, setDhtProxyName] = React.useState("")
    const [pushNotifications, setPushNotifications] = React.useState(false)

    const [open, setOpen] = React.useState(false)
    const [message, setMessage] = React.useState(false)
    const [severity, setSeverity] = React.useState("success")

    React.useEffect(()=>{
        setBlueprintName(props.blueprintName)
        
        axios(configApiCall(api_path_blueprint_configuration, 'GET', {"queryString": props.blueprintName}, null)).then((response) => {
            response.data.map((blueprint) => {
                setUPnP(blueprint["uPnP"])
                setTurn(blueprint["turn"])
                setTurnServerAddress(blueprint["turnServerAddress"])
                setTurnUsername(blueprint["turnUsername"])
                setTurnPassword(blueprint['turnPassword'])
                setBootstrap(blueprint["bootstrap"])
                setBootstrapName(blueprint["bootstrapName"])
                setDhtProxy(blueprint["dhtProxy"])
                setDhtProxyName(blueprint["dhtProxyName"])
                setPushNotifications(blueprint["pushNotifications"])
            })
        }).catch((error) => {
            console.log("Error fetching blueprint permissions : " + props.username + " " + error)
        })
    }, [])

    const handleUpdateConfiguration = () => {
        const data = {
            'uPnP': uPnP,
            'turn': turn,
            'turnServerAddress': turnServerAddress,
            'turnUsername': turnUsername,
            'turnPassword': turnPassword,
            'bootstrap': bootstrap,
            'dhtProxy': dhtProxy,
            'dhtProxyName': dhtProxyName,
            'pushNotifications': pushNotifications
        }

        axios(configApiCall(api_path_blueprint_configuration, 'PUT', data, null)).then((response) => {
            setOpen(false)
            setSeverity("success")
            setOpen(true)
            setMessage('Updated blueprint configuration successfully !')
        }).catch((error) => {
            setOpen(false)
            setSeverity("error")
            setOpen(true)
            setMessage('Error updating blueprint configuration ' + error + '!')
        })
    }

    const initUpdateConfiguration = useCallback(debounce((searchValue) => handleUpdateConfiguration(), 500), [])

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
                        <BuildOutlinedIcon />
                    </CardIcon>
                    <p className={classes.cardCategory}>Permissions</p>
                    <h3 className={classes.cardTitle}>{props.blueprintName}</h3>
                </CardHeader>
                <CardBody profile>
                    <div className={classes.root}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12}>
                            <FormGroup row>
                                <FormControlLabel
                                    control={<Checkbox checked={uPnP} color="primary" onChange={e => {
                                        setUPnP(e.target.checked);
                                        handleUpdateConfiguration();
                                    }} name="uPnP" />}
                                    label="UPnP"
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <FormGroup row>
                                <FormControlLabel
                                    control={<Checkbox checked={turn} color="primary" onChange={e => {
                                        setTurn(e.target.checked);
                                        handleUpdateConfiguration();
                                    }} name="turn" />}
                                    label="TURN"
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8}>
                            <FormGroup row>
                                <FormControl className={classes.margin} size="large">
                                        <InputLabel htmlFor="turnServerAddress">TURN Server address</InputLabel>
                                        <Input
                                        disabled={!turn}
                                        id="turnServerAddress"
                                        placeholder={turnServerAddress}
                                        startAdornment={
                                            <InputAdornment position="start">
                                            <DnsOutlinedIcon />
                                            </InputAdornment>   
                                        }
                                        onChange={e => {
                                            setTurnServerAddress(e.target.value);
                                            initUpdateConfiguration();
                                        }}
                                        />
                                </FormControl>
                            </FormGroup>
                            <FormGroup row>
                                <FormControl className={classes.margin} size="large">
                                        <InputLabel htmlFor="turnUsername">TURN username</InputLabel>
                                        <Input
                                        disabled={!turn}
                                        id="turnUsername"
                                        placeholder={turnUsername}
                                        startAdornment={
                                            <InputAdornment position="start">
                                            <AccountCircleIcon />
                                            </InputAdornment>
                                        }
                                        onChange={e => {
                                            setTurnUsername(e.target.value);
                                            initUpdateConfiguration();
                                        }}
                                        />
                                </FormControl>
                            </FormGroup>
                            <FormGroup row>
                                <FormControl className={classes.margin} size="large">
                                        <InputLabel htmlFor="turnPassword">TURN password</InputLabel>
                                        <Input
                                        disabled={!turn}
                                        id="turnPassword"
                                        placeholder={turnPassword}
                                        startAdornment={
                                            <InputAdornment position="start">
                                            <VpnKeyOutlinedIcon />
                                            </InputAdornment>
                                        }
                                        onChange={e => {
                                            setTurnPassword(e.target.value);
                                            initUpdateConfiguration();
                                        }}
                                        />
                                </FormControl>
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <FormGroup row>
                                <FormControlLabel
                                    control={<Checkbox checked={bootstrap} color="primary" onChange={e => {
                                        setBootstrap(e.target.checked);
                                        handleUpdateConfiguration();
                                    }} name="bootstrap" />}
                                    label="Bootstrap"
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8}>
                            <FormGroup row>
                                <FormControl className={classes.margin} size="large">
                                        <InputLabel htmlFor="bootstrapName">Bootstrap servername name</InputLabel>
                                        <Input
                                        disabled={!bootstrap}
                                        id="bootstrapName"
                                        placeholder={bootstrapName}
                                        startAdornment={
                                            <InputAdornment position="start">
                                            <StorageOutlinedIcon />
                                            </InputAdornment>
                                        }
                                        onChange={e => {
                                            setBootstrapName(e.target.value);
                                            initUpdateConfiguration();
                                        }}
                                        />
                                </FormControl>
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <FormGroup row>
                                <FormControlLabel
                                    control={<Checkbox checked={dhtProxy} color="primary" onChange={e => {
                                        setDhtProxy(e.target.checked);
                                        handleUpdateConfiguration();
                                    }} name="dhtProxy" />}
                                    label="Dht proxy"
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8}>
                            <FormGroup row>
                                <FormControl className={classes.margin} size="large">
                                        <InputLabel htmlFor="dhtProxyName">DHT proxy name</InputLabel>
                                        <Input
                                        disabled={!dhtProxy}
                                        id="dhtProxyName"
                                        placeholder={dhtProxyName}
                                        startAdornment={
                                            <InputAdornment position="start">
                                            <LanguageOutlinedIcon />
                                            </InputAdornment>
                                        }
                                        onChange={e => {
                                            setDhtProxyName(e.target.value);
                                            initUpdateConfiguration();
                                        }}
                                        />
                                </FormControl>
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <FormGroup row>
                                <FormControlLabel
                                    control={<Checkbox checked={pushNotifications} color="primary" onChange={e => {
                                        setPushNotifications(e.target.checked);
                                        handleUpdateConfiguration();
                                    }} name="pushNotifications" />}
                                    label="Push notifications"
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