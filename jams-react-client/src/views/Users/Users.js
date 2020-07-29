import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
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

import PersonIcon from '@material-ui/icons/Person';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import PhoneOutlinedIcon from '@material-ui/icons/PhoneOutlined';
import BusinessOutlinedIcon from '@material-ui/icons/BusinessOutlined';
import Search from "@material-ui/icons/Search";

import MailOutlineIcon from '@material-ui/icons/MailOutline';
import axios from "axios";
import configApiCall from "api.js";
import auth from 'auth.js'
import { api_path_get_user_directory_search } from "globalUrls";

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';

import jami from "assets/img/faces/jami.png";
import noProfilePicture from "assets/img/faces/no-profile-picture.png";
import EditCreateUserProfile from "views/UserProfile/EditCreateUserProfile";

import LinearProgress from '@material-ui/core/LinearProgress';

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
    },  
    search : {
        width: "90%"
    },
    loading: {
        width: '100%',
    }
};

const useStyles = makeStyles(styles);

export default function Users() {
    const classes = useStyles();
    const history = useHistory();
    const [users, setUsers] = React.useState([])
    const [selectedUsername, setSelectedUsername] = React.useState("")
    const [createUser, setCreateUser] = React.useState(false)
    const [searchValue, setSearchValue] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [progress, setProgress] = React.useState(0);

    useEffect(() => {
        setLoading(true)
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
              if (oldProgress === 100) {
                return 0;
              }
              const diff = Math.random() * 10;
              return Math.min(oldProgress + diff, 100);
            });
          }, 500);
        axios(configApiCall(api_path_get_user_directory_search, 'GET', {"queryString":"*"}, null)).then((response)=>{
            let orginalUsers = response.data
            orginalUsers.map((user) => {
                user.display = ""
            })
            setUsers(orginalUsers)
            setLoading(false)
        }).catch((error) =>{
            console.log(error);
            if(error.response.status == 401){
                auth.authenticated = false
                history.push('/')
            }
        });
        return () => {
            clearInterval(timer);
          };
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
        history.push('/admin')
    }

    if (!auth.hasAdminScope()) {
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
                                placeholder: "Search users using (username, name, phone, email, ...)",
                                inputProps: {
                                "aria-label": "Search users"
                                },
                                onKeyUp: (e) => setSearchValue(e.target.value),
                            }}
                            />
                            <Search />
                            <div className={classes.loading}>
                                {loading && <LinearProgress variant="determinate" value={progress} />}
                            </div>
                        </div>
                    </GridItem>
                    {
                    users.filter((data)=>{
                        if(searchValue == null)
                            return data
                        else if((data.username != null ) && data.username.toLowerCase().includes(searchValue.toLowerCase()) || 
                                (data.firstName != null ) &&  data.firstName.toLowerCase().includes(searchValue.toLowerCase()) || 
                                (data.lastName != null ) &&  data.lastName.toLowerCase().includes(searchValue.toLowerCase()) || 
                                (data.organization != null ) &&  data.organization.toLowerCase().includes(searchValue.toLowerCase()) ||
                                (data.email != null ) &&  data.email.toLowerCase().includes(searchValue.toLowerCase()) ||
                                (data.phoneNumber != null ) &&  data.phoneNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
                                (data.phoneNumberExtension != null ) &&  data.phoneNumberExtension.toLowerCase().includes(searchValue.toLowerCase()) ||
                                (data.mobileNumber != null ) &&  data.mobileNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
                                (data.faxNumber != null ) &&  data.faxNumber.toLowerCase().includes(searchValue.toLowerCase())
                                ){
                            return data
                        }
                    }).map(user =>
                    <GridItem xs={12} sm={12} md={2} key={user.username} style={{display: user.display}}>
                            
                                <Card profile>
                                    <CardBody profile>
                                        <a href="#" onClick={(e) => redirectToUserProfile(e, user.username)}>
                                        <CardAvatar profile>
                                            <img src={user.profilePicture ? ('data:image/png;base64, ' + user.profilePicture) : noProfilePicture} alt="..." />
                                        </CardAvatar>
                                        
                                        <h4 className={classes.cardTitle}>{user.firstName} {user.lastName}</h4>    
                                        <ul>
                                            <li><img src={jami} width="20" alt="Jami" style={{marginRight: "10px"}} /> {user.username}</li>
                                            <li><BusinessOutlinedIcon fontSize='small' style={{marginRight: "10px"}} /> {user.organization ? user.organization : 'No organization'}</li>
                                        </ul>
                                        </a>
                                    </CardBody>
                                </Card>

                    </GridItem>)
                    }
                </GridContainer>
            </div>
        );
    }


}
