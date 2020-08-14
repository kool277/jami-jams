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
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

import DnsOutlinedIcon from '@material-ui/icons/DnsOutlined';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import StorageOutlinedIcon from '@material-ui/icons/StorageOutlined';
import LanguageOutlinedIcon from '@material-ui/icons/LanguageOutlined';

import { hexToRgb, blackColor } from "assets/jss/material-dashboard-react.js";

import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';

import axios from "axios"
import configApiCall from "../../api"
import { api_path_blueprints } from "../../globalUrls"

import Snackbar from '@material-ui/core/Snackbar';

import MuiAlert from '@material-ui/lab/Alert';

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

import { debounce } from "lodash";


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

    const [videoEnabled, setVideoEnabled] = React.useState(false);
    const [allowPeersFromContact, setAllowPeersFromContact] = React.useState(false);
    const [autoAnswer, setAutoAnswer] = React.useState(false);
    const [accountPeerDiscovery, setAccountPeerDiscovery] = React.useState(false);

    const [upnpEnabled, setUpnpEnabled] = React.useState(false)
    const [turnEnabled, setTurnEnabled] = React.useState(false)
    const [turnServer, setTurnServer] = React.useState("")
    const [turnServerUserName, setTurnServerUserName] = React.useState("")
    const [turnServerPassword, setTurnServerPassword] = React.useState("")
    const [proxyEnabled, setProxyEnabled] = React.useState("")
    const [proxyServer, setProxyServer] = React.useState("")
    const [accountDhtProxyListUrl, setAccountDhtProxyListUrl] = React.useState("")

    const [open, setOpen] = React.useState(false)
    const [message, setMessage] = React.useState(false)
    const [severity, setSeverity] = React.useState("success")

    React.useEffect(()=>{
        axios(configApiCall(api_path_blueprints+"?name="+props.blueprintName, 'GET', null, null)).then((response) => {
            let policyData = JSON.parse(response.data.policyData);
            setVideoEnabled(policyData["videoEnabled"]);
            setAllowPeersFromContact(policyData["allowPeersFromContact"]);
            setAutoAnswer(policyData["autoAnswer"]);
            setAccountPeerDiscovery(policyData["Account.peerDiscovery"]);

            setUpnpEnabled(policyData["upnpEnabled"])
            setTurnEnabled(policyData["turnEnabled"])
            setTurnServer(policyData["turnServer"])
            setTurnServerUserName(policyData["turnServerUserName"])
            setTurnServerPassword(policyData['turnServerPassword'])
            setProxyEnabled(policyData["proxyEnabled"])
            setProxyServer(policyData["proxyServer"])
            setAccountDhtProxyListUrl(policyData["Account.dhtProxyListUrl"])
        }).catch((error) => {
            console.log("Error fetching blueprint permissions : " + props.username + " " + error)
        })
    }, [])

    const handleUpdateConfiguration = (field, value) => {
        let data = {
            "videoEnabled": videoEnabled,
            "allowPeersFromContact": allowPeersFromContact,
            "allowPeersFromHistory": allowPeersFromContact,
            "allowPeersFromTrusted": allowPeersFromContact,
            "autoAnswer": autoAnswer,
            "Account.peerDiscovery": accountPeerDiscovery,
            "Account.accountDiscovery": accountPeerDiscovery,
            "Account.accountPublish": accountPeerDiscovery,
            "upnpEnabled": upnpEnabled,
            "turnEnabled": turnEnabled,
            "turnServer": turnServer,
            "turnServerUserName": turnServerUserName,
            "turnServerPassword": turnServerPassword,
            "proxyEnabled": proxyEnabled,
            "proxyServer": proxyServer,
            "Account.dhtProxyListUrl": accountDhtProxyListUrl
        }

        if(field === "accountDhtProxyListUrl"){
            data["Account.dhtProxyListUrl"] = value;
        }else{
            data[field] = value;
        }

        axios(configApiCall(api_path_blueprints+"?name="+props.blueprintName, 'PUT', data, null)).then((response) => {
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

    //const initUpdateConfiguration = useCallback(debounce((field, value) => handleUpdateConfiguration(fields), 500), [])

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
                                    control={<Checkbox checked={upnpEnabled} color="primary" onChange={e => {
                                        setUpnpEnabled(e.target.checked);
                                        handleUpdateConfiguration("upnpEnabled", e.target.checked);
                                    }} name="upnpEnabled" />}
                                    label="UPnP"
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <FormGroup row>
                                <FormControlLabel
                                    control={<Checkbox checked={turnEnabled} color="primary" onChange={e => {
                                        setTurnEnabled(e.target.checked);
                                        handleUpdateConfiguration("turnEnabled", e.target.checked);
                                    }} name="turnEnabled" />}
                                    label="TURN"
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8}>
                            <FormGroup row>
                                <FormControl className={classes.margin} size="large">
                                        <InputLabel htmlFor="turnServer">TURN Server address</InputLabel>
                                        <Input
                                        disabled={!turnEnabled}
                                        id="turnServer"
                                        placeholder={turnServer}
                                        startAdornment={
                                            <InputAdornment position="start">
                                            <DnsOutlinedIcon />
                                            </InputAdornment>   
                                        }
                                        onChange={e => {
                                            setTurnServer(e.target.value);
                                            handleUpdateConfiguration("turnServer", e.target.value);
                                        }}
                                        />
                                </FormControl>
                            </FormGroup>
                            <FormGroup row>
                                <FormControl className={classes.margin} size="large">
                                        <InputLabel htmlFor="turnServerUserName">TURN server username</InputLabel>
                                        <Input
                                        disabled={!turnEnabled}
                                        id="turnServerUserName"
                                        placeholder={turnServerUserName}
                                        startAdornment={
                                            <InputAdornment position="start">
                                            <AccountCircleIcon />
                                            </InputAdornment>
                                        }
                                        onChange={e => {
                                            setTurnServerUserName(e.target.value);
                                            handleUpdateConfiguration("turnServerUserName", e.target.value);
                                        }}
                                        />
                                </FormControl>
                            </FormGroup>
                            <FormGroup row>
                                <FormControl className={classes.margin} size="large">
                                        <InputLabel htmlFor="turnServerPassword">TURN server password</InputLabel>
                                        <Input
                                        disabled={!turnEnabled}
                                        id="turnServerPassword"
                                        placeholder={turnServerPassword}
                                        startAdornment={
                                            <InputAdornment position="start">
                                            <VpnKeyOutlinedIcon />
                                            </InputAdornment>
                                        }
                                        onChange={e => {
                                            setTurnServerPassword(e.target.value);
                                            handleUpdateConfiguration("turnServerPassword", e.target.value);
                                        }}
                                        />
                                </FormControl>
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <FormGroup row>
                                <FormControlLabel
                                    control={<Checkbox checked={proxyEnabled} color="primary" onChange={e => {
                                        setProxyEnabled(e.target.checked);
                                        handleUpdateConfiguration("proxyEnabled", e.target.checked);
                                    }} name="proxyEnabled" />}
                                    label="Dht proxy"
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8}>
                            <FormGroup row>
                                <FormControl className={classes.margin} size="large">
                                        <InputLabel htmlFor="proxyServer">DHT proxy server name</InputLabel>
                                        <Input
                                        disabled={!proxyEnabled}
                                        id="proxyServer"
                                        placeholder={proxyServer}
                                        startAdornment={
                                            <InputAdornment position="start">
                                            <LanguageOutlinedIcon />
                                            </InputAdornment>
                                        }
                                        onChange={e => {
                                            setProxyServer(e.target.value);
                                            handleUpdateConfiguration("proxyServer", e.target.value);
                                        }}
                                        />
                                </FormControl>
                            </FormGroup>
                            <FormGroup row>
                                <FormControl className={classes.margin} size="large">
                                        <InputLabel htmlFor="accountDhtProxyListUrl">DHT proxy List URL</InputLabel>
                                        <Input
                                        disabled={!proxyEnabled}
                                        id="proxyServer"
                                        placeholder={accountDhtProxyListUrl}
                                        startAdornment={
                                            <InputAdornment position="start">
                                            <LanguageOutlinedIcon />
                                            </InputAdornment>
                                        }
                                        onChange={e => {
                                            setAccountDhtProxyListUrl(e.target.value);
                                            handleUpdateConfiguration("accountDhtProxyListUrl", e.target.value);
                                        }}
                                        />
                                </FormControl>
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