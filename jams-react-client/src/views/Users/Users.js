import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import UserProfile from "views/UserProfile/UserProfile.js"
import PersonIcon from '@material-ui/icons/Person';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import PhoneOutlinedIcon from '@material-ui/icons/PhoneOutlined';
import BusinessOutlinedIcon from '@material-ui/icons/BusinessOutlined';

import MailOutlineIcon from '@material-ui/icons/MailOutline';
import axios from "axios";
import configApiCall from "api.js";
import { api_path_get_user_directory_search } from "globalUrls";

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';

import jami from "assets/img/faces/jami.png";
import noProfilePicture from "assets/img/faces/no-profile-picture.png";

const styles = {
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
    }
};

const useStyles = makeStyles(styles);

export default function Users() {
    const classes = useStyles();
    const [users, setUsers] = React.useState([])

    useEffect(() => {
        axios(configApiCall(api_path_get_user_directory_search, 'GET', {"queryString":"*"}, null)).then((response)=>{
            setUsers(response.data)
        }   
        ).catch((error) =>{
            console.log(error);
        });
    }, []);

    const [selectedProfile, setSelectedProfile] = useState(false);

    function redirectToUserProfile(e) {
        e.preventDefault()
        setSelectedProfile(true);
    }
    function redirectToUsers(e) {
        e.preventDefault()
        setSelectedProfile(false);
    }

    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }

    if (selectedProfile) {
        return (
            <div>
                <Button variant="contained" color="info" href="#contained-buttons" onClick={redirectToUsers}>
                    <KeyboardReturnIcon />
                </Button>
                <UserProfile />
            </div>
        )
    } else {
        return (
            <div>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Button variant="contained" color="primary" href="#contained-buttons">
                        <AddCircleOutlineIcon /> Create user
                        </Button>
                    </GridItem>
                    {
                    users.map(user => 
                    <GridItem xs={12} sm={12} md={2} key={user.username}>
                            <a href="#" onClick={redirectToUserProfile}>
                                <Card profile>
                                    <CardBody profile>
                                        <CardAvatar profile>
                                            <img src={user.profilePicture ? ('data:image/png;base64, ' + user.profilePicture) : noProfilePicture} alt="..." />
                                        </CardAvatar>
                                        <h4 className={classes.cardTitle}>{user.firstName} {user.lastName}</h4>    
                                        <ul>
                                            <li><img src={jami} width="20" alt="Jami" /> {user.username}</li>
                                            <li><BusinessOutlinedIcon fontSize='small' /> {user.organization ? user.organization : 'No organization'}</li>
                                        </ul>
                                    </CardBody>
                                </Card>
                            </a>
                    </GridItem>)
                    }
                </GridContainer>
            </div>
        );
    }


}
