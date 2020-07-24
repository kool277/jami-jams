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
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import PersonIcon from '@material-ui/icons/Person';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import PhoneOutlinedIcon from '@material-ui/icons/PhoneOutlined';
import BusinessOutlinedIcon from '@material-ui/icons/BusinessOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import Search from "@material-ui/icons/Search";
import IconButton from '@material-ui/core/IconButton';

import MailOutlineIcon from '@material-ui/icons/MailOutline';
import axios from "axios";
import configApiCall from "api.js";
import auth from 'auth.js'
import {
        api_path_get_user_directory_search,
        api_path_delete_admin_user_revoke 
        } from "globalUrls";

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';

import jami from "assets/img/faces/jami.png";
import noProfilePicture from "assets/img/faces/no-profile-picture.png";
import EditCreateUserProfile from "views/UserProfile/EditCreateUserProfile";


import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";

const styles = {
    ...headerLinksStyle,
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
    deleteIcon : {
        float: "right"
    }
};

const useStyles = makeStyles(styles);

export default function Users() {
    const classes = useStyles();
    const [users, setUsers] = React.useState([])
    const [open, setOpen] = React.useState(false);
    const [revokedUser, setRevokedUser] = React.useState("");
    const [selectedUsername, setSelectedUsername] = React.useState("")
    const [createUser, setCreateUser] = React.useState(false)

    useEffect(() => {
        setRevokedUser('')
        axios(configApiCall(api_path_get_user_directory_search, 'GET', {"queryString":"*"}, null)).then((response)=>{
            setUsers(response.data)
        }   
        ).catch((error) =>{
            console.log(error);
        });
    }, []);

    const [selectedProfile, setSelectedProfile] = useState(false);

    function redirectToUserProfile(e, username) {
        e.preventDefault()
        setSelectedProfile(true);
        setSelectedUsername(username)
    }
    function redirectToUsers(e) {
        e.preventDefault()
        setSelectedProfile(false);
    }

    function revokeUser(){

        const data = {
            'username': revokedUser
        }

        axios(configApiCall(api_path_delete_admin_user_revoke, 'DELETE', data, null)).then((result)=>{
            console.log("Revoked user: " + revokedUser);
        }).catch((error)=> {
            console.log("Error revoking user: " + revokedUser + ' with error: ' + error);
        });
        setOpen(false);
    }

    const handleClickOpen = (username) => {
        setRevokedUser(username)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (selectedProfile && !auth.hasAdminScope()) {
        return (
            <div>
                <UserProfile username={auth.getUsername()}/>
            </div>
        )
    } else if(selectedProfile && auth.hasAdminScope()){
        return (
            <div>
                <Button variant="contained" color="info" href="#contained-buttons" onClick={redirectToUsers}>
                    <KeyboardReturnIcon />
                </Button>
                <UserProfile username={selectedUsername}/>
            </div>
        )
    } else if (createUser) {
        return(
            <EditCreateUserProfile createUser={createUser} setCreateUser={setCreateUser}/>
        )
    }
    else {
        return (
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Revoke user account"}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to revoke <strong>{revokedUser}</strong> ?
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={revokeUser} color="danger" autoFocus>
                        Revoke
                    </Button>
                    </DialogActions>
                </Dialog>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        {auth.isLocalDirectory() &&
                            <Button variant="contained" color="primary" href="#contained-buttons" onClick={e => setCreateUser(true)}>
                                <AddCircleOutlineIcon /> Create user
                            </Button>
                        }
                        <div className={classes.searchWrapper}>
                            <CustomInput
                            formControlProps={{
                                className: classes.margin + " " + classes.search
                            }}
                            inputProps={{
                                placeholder: "Search users",
                                inputProps: {
                                "aria-label": "Search users"
                                }
                            }}
                            />
                            <Search />
                        </div>
                    </GridItem>
                    {
                    users.map(user => 
                    <GridItem xs={12} sm={12} md={2} key={user.username}>
                            
                                <Card profile>
                                    <CardBody profile>
                                        <a href="#" onClick={(e) => redirectToUserProfile(e, user.username)}>
                                        <CardAvatar profile>
                                            <img src={user.profilePicture ? ('data:image/png;base64, ' + user.profilePicture) : noProfilePicture} alt="..." />
                                        </CardAvatar>
                                        
                                        <h4 className={classes.cardTitle}>{user.firstName} {user.lastName}</h4>    
                                        <ul>
                                            <li><img src={jami} width="20" alt="Jami" /> {user.username}</li>
                                            <li><BusinessOutlinedIcon fontSize='small' /> {user.organization ? user.organization : 'No organization'}</li>
                                        </ul>
                                        </a>
                                        <Divider variant="middle" />
                                        <IconButton aria-label="delete" className={classes.deleteIcon} onClick={() => handleClickOpen(user.username)}>
                                            <DeleteIcon fontSize="small" color="error" />
                                        </IconButton>
                                    </CardBody>
                                </Card>

                    </GridItem>)
                    }
                </GridContainer>
            </div>
        );
    }


}
