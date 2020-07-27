import React, {useEffect} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import noProfilePicture from "assets/img/faces/no-profile-picture.png";


import Grid from '@material-ui/core/Grid';
import BusinessCenterOutlinedIcon from '@material-ui/icons/BusinessCenterOutlined';
import AlternateEmailOutlinedIcon from '@material-ui/icons/AlternateEmailOutlined';
import PhoneInTalkOutlinedIcon from '@material-ui/icons/PhoneInTalkOutlined';
import SmartphoneOutlinedIcon from '@material-ui/icons/SmartphoneOutlined';
import LocalPrintshopOutlinedIcon from '@material-ui/icons/LocalPrintshopOutlined';
import PhoneForwardedOutlinedIcon from '@material-ui/icons/PhoneForwardedOutlined';
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';
import AccountBoxOutlinedIcon from '@material-ui/icons/AccountBoxOutlined';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';


import auth from "auth.js"
import configApiCall from "api.js";
import { api_path_get_admin_user, api_path_get_user, api_path_get_user_directory_search} from "globalUrls";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

import {
    infoColor
} from "assets/jss/material-dashboard-react.js";
import { hexToRgb, blackColor } from "assets/jss/material-dashboard-react.js";
import axios from "axios";
import FormControl from "@material-ui/core/FormControl";
import PersonIcon from "../../../node_modules/@material-ui/icons/Person";


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
    },
    // controls: {
    //     padding: 16,
    //     display: 'flex',
    //     flexDirection: 'column',
    //     alignItems: 'stretch',
    //     [theme.breakpoints.up('sm')]: {
    //       flexDirection: 'row',
    //       alignItems: 'center',
    //     },
    // },
    // sliderContainer: {
    //     display: 'flex',
    //     flex: '1',
    //     alignItems: 'center',
    //   },
    //   sliderLabel: {
    //     [theme.breakpoints.down('xs')]: {
    //       minWidth: 65,
    //     },
    // },
    // slider: {
    //     padding: '22px 0px',
    //     marginLeft: 16,
    //     [theme.breakpoints.up('sm')]: {
    //         flexDirection: 'row',
    //         alignItems: 'center',
    //         margin: '0 16px',
    //     },
    // },
});

const useStyles = makeStyles(styles);

export default function DisplayUserProfile(props) {
    const classes = useStyles();

    const [users, setUsers] = React.useState([])
    const [userStatus, setUserStatus] = React.useState('')
    const  searchData = {
        "queryString":props.username
    };

    const  userData = {
        "username":props.username
    };
    const [value, setValue] = React.useState(0);
    useEffect(() => {
        auth.checkDirectoryType(() => {
            if(auth.hasAdminScope()){
                axios(configApiCall(api_path_get_admin_user, 'GET', userData, null)).then((response)=>{
                        setStatus(response.data)
                    }
                ).catch((error) =>{
                    console.log(error);
                });
            }
            else{
                axios(configApiCall(api_path_get_user, 'GET', null, null)).then((response)=>{
                        setStatus(response.data)
                    }
                ).catch((error) =>{
                    console.log(error);
                });
            }
        })
        axios(configApiCall(api_path_get_user_directory_search, 'GET', searchData, null)).then((response)=>{
                setUsers(response.data)
            }
        ).catch((error) =>{
            console.log(error);
        });
    }, []);

    function setStatus(data) {
        if (data.revoked)
            setUserStatus("Revoked");
        else
            setUserStatus("Active");
    }
    console.log(userStatus)
    return (
        <div>
        {users.map(user =>
            <GridContainer>
                <Grid item xs={12} sm={12} md={8}>
                    <Card profile>
                        <CardHeader color="info" stats icon>
                            <CardIcon color="info">
                                <AccountBoxOutlinedIcon />
                            </CardIcon>
                            <p className={classes.cardCategory}>{"Profile information"}</p>
                            <h3 className={classes.cardTitle}>{user.username}</h3>
                        </CardHeader>
                        <CardBody profile>
                            <div className={classes.root}>
                                <GridContainer spacing={5}>
                                    <Grid item xs={12} sm={12} md={6}>
                                        <Grid container spacing={5} >
                                            <Grid item align="center" xs={12} sm={12} md={12} >
                                                <img src={user.profilePicture ? ('data:image/png;base64, ' + user.profilePicture) : noProfilePicture} className={classes.editProfilePicture} alt="..." />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <Grid container spacing={5}>
                                            <Grid item xs={12} sm={12} md={12}>
                                                <FormControl className={classes.margin} fullWidth>
                                                    <span><AccountCircleIcon /> {user.username ? user.username : 'no username'}, {userStatus ? userStatus: "no user status"}</span>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={12}>
                                                <FormControl className={classes.margin} fullWidth>
                                                    <span> <PersonIcon /> {user.firstName ? user.firstName : 'no firstname'}</span>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={12}>
                                                <FormControl className={classes.margin} fullWidth>
                                                    <span><PersonOutlinedIcon/> {user.lastName ? user.lastName : 'no lastname'}</span>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </GridItem>

                                    <Grid item xs={12} sm={12} md={6}>
                                        <FormControl className={classes.margin} fullWidth>
                                            <span> <AlternateEmailOutlinedIcon/> {user.email ? user.email : 'no email'}  </span>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6}>
                                        <FormControl className={classes.margin} fullWidth>
                                            <span> <BusinessCenterOutlinedIcon/> {user.organization ? user.organization : 'no organization'}  </span>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6}>
                                        <FormControl className={classes.margin} fullWidth>
                                            <span> <PhoneInTalkOutlinedIcon/> {user.phoneNumber ? user.phoneNumber : 'no phone number'}  </span>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6}>
                                        <FormControl className={classes.margin} fullWidth>
                                            <span> <PhoneForwardedOutlinedIcon/> {user.phoneNumberExtension ? user.phoneNumberExtension : 'no Extension'}  </span>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6}>
                                        <FormControl className={classes.margin} fullWidth>
                                            <span> <SmartphoneOutlinedIcon/> {user.mobileNumber ? user.mobileNumber : 'no mobile number'}  </span>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6}>
                                        <FormControl className={classes.margin} fullWidth>
                                            <span> <LocalPrintshopOutlinedIcon/> {user.faxNumber ? user.faxNumber : 'no fax number'}  </span>
                                        </FormControl>
                                    </Grid>
                                </GridContainer>
                            </div>
                        </CardBody>
                        <CardFooter>
                            <Button color="info" onClick={() => props.setDisplayUser(false)}>Edit Profile</Button>
                            {auth.hasAdminScope() && (userStatus == "Active" || userStatus == '') && <Button color="danger">Revoke Profile</Button>}
                        </CardFooter>
                    </Card>
                </Grid>

            </GridContainer>
        )}
        </div>
    );
}