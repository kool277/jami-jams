import React, {useEffect} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import BusinessCenterOutlinedIcon from '@material-ui/icons/BusinessCenterOutlined';
import AlternateEmailOutlinedIcon from '@material-ui/icons/AlternateEmailOutlined';
import PhoneInTalkOutlinedIcon from '@material-ui/icons/PhoneInTalkOutlined';
import SmartphoneOutlinedIcon from '@material-ui/icons/SmartphoneOutlined';
import LocalPrintshopOutlinedIcon from '@material-ui/icons/LocalPrintshopOutlined';
import PhoneForwardedOutlinedIcon from '@material-ui/icons/PhoneForwardedOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';

import auth from "auth.js"
import configApiCall from "api.js";
import { api_path_get_admin_user, api_path_get_user, api_path_get_user_directory_search} from "globalUrls";

import noProfilePicture from "assets/img/faces/no-profile-picture.png";

import {
    infoColor
} from "assets/jss/material-dashboard-react.js";
import axios from "axios";


export default function DisplayUserProfile(props) {
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
            <GridContainer spacing={3}>
                <GridItem xs={12} sm={12} md={8}>
                    <Card profile>
                        <CardAvatar profile>
                                <img src={user.profilePicture ? ('data:image/png;base64, ' + user.profilePicture) : noProfilePicture} alt="..." />
                        </CardAvatar>
                        <CardBody>
                            <GridContainer spacing={3}>
                                <GridItem xs={12} sm={12} md={12}>
                                    <span>{user.username ? user.username : 'no username'}, {userStatus ? userStatus: "no user status"}</span>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                        <Grid container direction="row" alignItems="center" spacing={1}>
                                            <Grid item>
                                                <PersonOutlineOutlinedIcon/>
                                            </Grid>
                                            <Grid item>
                                                {user.firstName ? user.firstName : 'no firstname'}
                                            </Grid>
                                        </Grid>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                        <Grid container direction="row" alignItems="center" spacing={1}>
                                            <Grid item>
                                                <PersonOutlinedIcon/>
                                            </Grid>
                                            <Grid item>
                                                {user.lastName ? user.lastName : 'no lastname'}
                                            </Grid>
                                        </Grid>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                        <Grid container direction="row" alignItems="center" spacing={1}>
                                            <Grid item>
                                                <AlternateEmailOutlinedIcon/>
                                            </Grid>
                                            <Grid item>
                                                {user.email ? user.email : 'no email'}
                                            </Grid>
                                        </Grid>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <Typography variant="subtitle2">
                                        <Grid container direction="row" alignItems="center" spacing={1}>
                                            <Grid item>
                                                <BusinessCenterOutlinedIcon/>
                                            </Grid>
                                            <Grid item>
                                                {user.organization ? user.organization : 'no organization'}
                                            </Grid>
                                        </Grid>
                                    </Typography>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <Typography variant="subtitle2">
                                        <Grid container direction="row" alignItems="center" spacing={1}>
                                            <Grid item>
                                                <PhoneInTalkOutlinedIcon/>
                                            </Grid>
                                            <Grid item>
                                                {user.phoneNumber ? user.phoneNumber : 'no phone number'}
                                            </Grid>
                                        </Grid>
                                    </Typography>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <Typography variant="subtitle2">
                                        <Grid container direction="row" alignItems="center" spacing={1}>
                                            <Grid item>
                                                <PhoneForwardedOutlinedIcon/>
                                            </Grid>
                                            <Grid item>
                                                {user.phoneNumberExtension ? user.phoneNumberExtension : 'no Extension'}
                                            </Grid>
                                        </Grid>
                                    </Typography>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <Typography variant="subtitle2">
                                        <Grid container direction="row" alignItems="center" spacing={1}>
                                            <Grid item>
                                                <SmartphoneOutlinedIcon/>
                                            </Grid>
                                            <Grid item>
                                                {user.mobileNumber ? user.mobileNumber : 'no mobile number'}
                                            </Grid>
                                        </Grid>
                                    </Typography>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <Typography variant="subtitle2">
                                        <Grid container direction="row" alignItems="center" spacing={1}>
                                            <Grid item>
                                                <LocalPrintshopOutlinedIcon/>
                                            </Grid>
                                            <Grid item>
                                                {user.faxNumber ? user.faxNumber : 'no fax number'}
                                            </Grid>
                                        </Grid>
                                    </Typography>
                                </GridItem>
                            </GridContainer>
                        </CardBody>
                        <CardFooter>
                            <Button color="info">Update Profile</Button>
                            {auth.hasAdminScope() && (userStatus == "Active" || userStatus == '') && <Button color="danger">Revoke Profile</Button>}
                        </CardFooter>
                    </Card>
                </GridItem>

            </GridContainer>
        )}
        </div>
    );
}