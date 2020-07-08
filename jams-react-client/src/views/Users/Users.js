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

import ajaxApiCall from "api.js";

import { api_path_post_auth_login, api_path_get_user_directory_search } from "globalUrls";

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';

import avatar1 from "assets/img/faces/cyrille_beraud.jpeg";
import avatar2 from "assets/img/faces/christophe_villemaire.jpeg";

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


    useEffect(() => {

    });

    const [selectedProfile, setSelectedProfile] = useState(false);

    function redirectToUserProfile(e) {
        e.preventDefault()
        setSelectedProfile(true);
    }
    function redirectToUsers(e) {
        e.preventDefault()
        setSelectedProfile(false);
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
                <Button variant="contained" color="primary" href="#contained-buttons">
                    <AddCircleOutlineIcon /> Create user
                </Button>
                <br></br><br></br>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={2}>
                        <a href="#" onClick={redirectToUserProfile}>
                            <Card profile>
                                <CardAvatar profile>
                                    <img src={avatar1} alt="..." />
                                </CardAvatar>
                                <CardBody profile>
                                    <h6 className={classes.cardCategory}>CEO</h6>
                                    <h4 className={classes.cardTitle}>Cyrille Béraud</h4>
                                    <p className={classes.description}>
                                        13 devices
                                </p>
                                </CardBody>
                            </Card>
                        </a>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={2}>
                        <a href="#" onClick={redirectToUserProfile}>
                            <Card profile>
                                <CardAvatar profile>
                                    <img src={avatar2} alt="..." />
                                </CardAvatar>
                                <CardBody profile>
                                    <h6 className={classes.cardCategory}>CEO</h6>
                                    <h4 className={classes.cardTitle}>Christophe Villemer</h4>
                                    <p className={classes.description}>
                                        10 devices
                                </p>
                                </CardBody>
                            </Card>
                        </a>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }


}
