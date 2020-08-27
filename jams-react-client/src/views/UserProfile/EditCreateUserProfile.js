import React from "react";
import { useHistory } from 'react-router-dom';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";

// core components
import Grid from '@material-ui/core/Grid';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Slider from '@material-ui/core/Slider';
import Typography from "@material-ui/core/Typography";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Cropper from 'react-easy-crop'
import getCroppedImg from './cropImage'

import { hexToRgb, blackColor } from "assets/jss/material-dashboard-react.js";

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BusinessCenterOutlinedIcon from '@material-ui/icons/BusinessCenterOutlined';
import AlternateEmailOutlinedIcon from '@material-ui/icons/AlternateEmailOutlined';
import PhoneInTalkOutlinedIcon from '@material-ui/icons/PhoneInTalkOutlined';
import PhoneForwardedOutlinedIcon from '@material-ui/icons/PhoneForwardedOutlined';
import SmartphoneOutlinedIcon from '@material-ui/icons/SmartphoneOutlined';
import LocalPrintshopOutlinedIcon from '@material-ui/icons/LocalPrintshopOutlined';
import PersonIcon from '@material-ui/icons/Person';
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';

import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import EditIcon from '@material-ui/icons/Edit';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';

import noProfilePicture from "assets/img/faces/no-profile-picture.png";

import axios from "axios"
import configApiCall from "../../api"
import {
    api_path_put_update_user_profile,
    api_path_post_create_user,
    api_path_post_create_user_profile,
    api_path_get_user_directory_search,
    api_path_get_exists_user
} from "../../globalUrls"

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

import FormikField from 'components/FormikField/FormikField';
import {Formik} from "formik";
import * as Yup from 'yup';

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
    },
    alignRight: {
        float: 'right'
    }
});

const useStyles = makeStyles(styles);

export default function EditCreateUserProfile(props) {
    const classes = useStyles();
    const history = useHistory();
    const [createUser, setCreateUser] = React.useState(props.createUser);
    const [userExists, setUserExists] = React.useState(false)

    const [firstName, setFirstName] = React.useState("")
    const [lastName, setLastName] = React.useState("")
    const [userName, setUserName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [profilePicture, setProfilePicture] = React.useState("")
    const [profilePicturePreview, setProfilePicturePreview] = React.useState(noProfilePicture)
    const [originalUploadedImage, setOriginalUploadedImage] = React.useState("")
    const [organization, setOrganization] = React.useState("")
    const [faxNumber, setFaxNumber] = React.useState("")
    const [phoneNumber, setPhoneNumber] = React.useState("")
    const [extension, setExtension] = React.useState("")
    const [mobileNumber, setMobileNumber] = React.useState("")
    const [openPassword, setOpenPassword] = React.useState(false)
    const [temporaryPassword, setTemporaryPassword] = React.useState("")

    const [open, setOpen] = React.useState(false);
    const [crop, setCrop] = React.useState({ x: 0, y: 0 })
    const [zoom, setZoom] = React.useState(1)
    const [aspect, setAspect] = React.useState(1/1)
    const [rotation, setRotation] = React.useState(0)

    const initialValues = {
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        profilePicture: "",
        organization: "",
        faxNumber: "",
        phoneNumber: "",
        phoneNumberExtension: "",
        mobileNumber: "",
        jamiId: ""
    }

    React.useEffect(()=>{
        if(!createUser){
            setUserName(props.username)
            axios(configApiCall(api_path_get_user_directory_search, 'GET', {"queryString": props.username}, null)).then((response) => {
                response.data.map((user) => {
                    initialValues.username = user.username;
                    initialValues.firstName = user.firstName;
                    initialValues.lastName = user.lastName;
                    initialValues.email = user.email;
                    initialValues.profilePicture = user.profilePicture;
                    setProfilePicture(user.profilePicture)
                    setProfilePicturePreview('data:image/png;base64, ' + user.profilePicture)
                    initialValues.organization = user.organization;
                    initialValues.faxNumber = user.faxNumber;
                    initialValues.phoneNumber = user.phoneNumber;
                    initialValues.phoneNumberExtension = user.phoneNumberExtension;
                    initialValues.mobileNumber = user.mobileNumber;
                })
            }).catch((error) => {
                console.log("Error fetching user : " + props.username + " " + error)
            })
        }
    }, [])

    const handleProfilePictureChange = (event) => {
        setOriginalUploadedImage(URL.createObjectURL(event.target.files[0]))
        fileUpload(event).then((data) => {
            setProfilePicture(data.base64)
            setProfilePicturePreview('data:image/png;base64, ' + data.base64)
            setOpen(true);
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleCancel = () => {
        history.push('/users');
    }

    const handleCancelUpdate = () => {
        props.setDisplayUser(true)
    }

    const handleUserProfileCreation = (data) => {
        axios(configApiCall(api_path_post_create_user_profile, 'POST', data, null)).then(() => {
            setOpenPassword(true)
        }).catch((error) => {
            console.log("Error creating user profile: " + error)
        })
    }

    const handleCreateUser = (data) => {
        axios(configApiCall(api_path_post_create_user + "?username="+ data.username, 'POST', null, null)).then((response) => {
            setTemporaryPassword(response.data["password"])
            handleUserProfileCreation(data)
        }).catch((error) => {
            console.log("Failed to create new user. This is either because the username is already in use" +
                " on the public nameserver, or another unknown error has occurred. " +
                "Please choose another one.");
        })
    }

    const handleUserExists = (input) => {
        const data = {
            "username": input
        }
        axios(configApiCall(api_path_get_exists_user, 'GET', data, null)).then((response) =>{
            if(response.status === 200){
                setUserExists(false)
            }
        }).catch((error) => {
            console.log("Error checking for existing users: " + error)
        })
    }

    const handleUserUpdate = () => {
        props.setDisplayUser(true)
    }

    const handleUpdateUser = (data) => {
        axios(configApiCall(api_path_put_update_user_profile, 'PUT', data, null)).then((response) => {
            handleUserUpdate();
        }).catch((error) => {
            console.log("Error updating user: " + error)
        })
    }

    const onCropChange = (crop) => {
        setCrop(crop)
    }

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        getCroppedImg(
            originalUploadedImage,
            croppedAreaPixels,
            rotation
        ).then((value) => {
            setProfilePicturePreview(value)
        })
    }

    const onZoomChange = (zoom) => {
        setZoom(zoom)
    }

    const handleClose = () => {
        setProfilePicturePreview(originalUploadedImage)
        setOpen(false);
    };

    const cropProfilePicture = () => {
        setProfilePicture(profilePicturePreview.replace("data:image/jpeg;base64,", ""))
        setOpen(false)
    }

    const handleClosePassword = () => {
        setOpenPassword(false);
        history.push('/users');
    }

    const handleFormikSubmit = (values) => {
        values.profilePicture=profilePicture;
        if(createUser){
            handleCreateUser(values);
        }else{
            handleUpdateUser(values);
        }
    }

    const EditCreateSchema = Yup.object().shape({
        username: Yup.string().min(2, 'Username is too short!').required('Required!').test('checkDuplUsername', 'Username exists!', function (value) {
            if(createUser){
                return new Promise((resolve, reject) => {
                        const data = {
                            "username": value.toLowerCase()
                        }
                        axios(configApiCall(api_path_get_exists_user, 'GET', data, null)).then((response) =>{
                            if(response.status === 200){
                                resolve(false)
                            }    
                            resolve(true)
                        }).catch((error) => {
                            console.log("Error checking for existing users: " + error)
                            resolve(true)
                        })
                });
            }else{
                return true;
            }
        }).matches(/^[a-zA-Z0-9]*$/, 'Only alphanumeric characters!'),
        firstName: Yup.string().min(2, 'First name is too short!'),
        lastName: Yup.string().min(2, 'Last Name is too short!'),
        email: Yup.string().email('Invalid email!'),
        profilePicture: Yup.string(),
        organization: Yup.string().min(2, 'Organization name is too short!'),
        faxNumber: Yup.string().matches(/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, 'Fax not valid!'),
        phoneNumber: Yup.string().matches(/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, 'Phone not valid!'),
        phoneNumberExtension: Yup.number().positive().integer(),
        mobileNumber: Yup.string().matches(/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, 'Mobile not valid!'),
    })

    return(
        <div>
            <Dialog
                open={openPassword}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Temporary password"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        New user successfully created. Here is the one time password: <strong>{temporaryPassword}</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePassword} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                classes={{ paper: classes.dialogPaper }}
            >
                <DialogTitle id="alert-dialog-title">{"Crop image"}</DialogTitle>
                <DialogContent>
                    <Cropper
                        image={originalUploadedImage}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={onCropChange}
                        onCropComplete={onCropComplete}
                        onZoomChange={onZoomChange}
                    />
                </DialogContent>
                <DialogActions>
                    <div className={classes.controls}>
                        <div className={classes.sliderContainer}>
                            <Typography
                                variant="overline"
                                classes={{ root: classes.sliderLabel }}
                            >
                                Zoom
                            </Typography>
                            <Slider
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                classes={{ container: classes.slider }}
                                onChange={(e, zoom) => setZoom(zoom)}
                            />
                        </div>
                        <div className={classes.sliderContainer}>
                            <Typography
                                variant="overline"
                                classes={{ root: classes.sliderLabel }}
                            >
                                Rotation
                            </Typography>
                            <Slider
                                value={rotation}
                                min={0}
                                max={360}
                                step={1}
                                aria-labelledby="Rotation"
                                classes={{ container: classes.slider }}
                                onChange={(e, rotation) => setRotation(rotation)}
                            />
                        </div>
                    </div>
                    <Button onClick={handleClose} color="info">
                        Cancel
                    </Button>
                    <Button onClick={cropProfilePicture} color="success" autoFocus>
                        Crop
                    </Button>
                </DialogActions>
            </Dialog>
            <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                    <Formik initialValues={initialValues} 
                    onSubmit={handleFormikSubmit}
                    validationSchema={EditCreateSchema}
                    >
                        {({ isValid, dirty, handleSubmit}) => (
                            <form onSubmit={handleSubmit}>
                                <Card profile>
                                    <CardHeader color="info" stats icon>
                                        <p className={classes.cardCategory}>{createUser ? "Create new profile" : "Edit profile"}</p>
                                        {createUser ? "" : <h3 className={classes.cardTitle}>{userName}</h3>}
                                    </CardHeader>
                                    <CardBody profile>
                                        <CardAvatar editProfile>
                                            <img src={profilePicturePreview} alt="..." className={classes.editProfilePicture}/>
                                        </CardAvatar>
                                        <div className={classes.root}>

                                            <Grid container spacing={5}>
                                                <Grid item xs={12} sm={12} md={12}>
                                                    <input accept="image/*"  className={classes.input} id="icon-button-file" type="file" onChange={handleProfilePictureChange}/>
                                                    <label htmlFor="icon-button-file" >
                                                        <IconButton color="info" aria-label="upload picture" component="span" >
                                                            <PhotoCamera />
                                                        </IconButton> Change profile image
                                                    </label>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={12}>
                                                    <Grid container spacing={5} >
                                                        {createUser &&
                                                        <Grid item align="center" xs={12} sm={12} md={12}>
                                                            <FormikField name="username" label="Username" placeholder="Username" 
                                                            startAdornment={
                                                                <InputAdornment position="start">
                                                                    <AccountCircleIcon />
                                                                </InputAdornment>
                                                            }
                                                            required/>
                                                        </Grid>
                                                        }
                                                    </Grid>
                                                </Grid>
                                                <Grid item align="center" xs={12} sm={12} md={6}>
                                                    <FormikField name="firstName" label="First name" placeholder="First name"
                                                    startAdornment={
                                                        <InputAdornment position="start">
                                                            <PersonIcon />
                                                        </InputAdornment>
                                                    }
                                                    />
                                                </Grid>
                                                <Grid item align="center" xs={12} sm={12} md={6}>
                                                    <FormikField name="lastName" label="Last name" placeholder="Last name"
                                                    startAdornment={
                                                        <InputAdornment position="start">
                                                            <PersonOutlinedIcon />
                                                        </InputAdornment>
                                                    }/>
                                                </Grid>
                                                <Grid item align="center" xs={12} sm={12} md={6}>
                                                    <FormikField name="email" label="Email" placeholder="Email"
                                                    startAdornment={
                                                        <InputAdornment position="start">
                                                            <AlternateEmailOutlinedIcon />
                                                        </InputAdornment>
                                                    }/>
                                                </Grid>
                                                <Grid item align="center" xs={12} sm={12} md={6}>
                                                    <FormikField name="organization" label="Organization" placeholder="Organization"
                                                    startAdornment={
                                                        <InputAdornment position="start">
                                                            <BusinessCenterOutlinedIcon />
                                                        </InputAdornment>
                                                    }
                                                    />
                                                </Grid>
                                                <Grid item align="center" xs={12} sm={12} md={6}>
                                                    <FormikField name="faxNumber" label="Fax number" placeholder="Fax number"
                                                    startAdornment={
                                                        <InputAdornment position="start">
                                                            <LocalPrintshopOutlinedIcon />
                                                        </InputAdornment>
                                                    }/>
                                                </Grid>
                                                <Grid item align="center" xs={12} sm={12} md={6}>
                                                    <FormikField name="phoneNumber" label="Phone number" placeholder="Phone number"
                                                    startAdornment={
                                                        <InputAdornment position="start">
                                                            <LocalPrintshopOutlinedIcon />
                                                        </InputAdornment>
                                                    }/>
                                                </Grid>
                                                <Grid item align="center" xs={12} sm={12} md={6}>
                                                    <FormikField name="phoneNumberExtension" label="Extension" placeholder="Extension"
                                                    startAdornment={
                                                        <InputAdornment position="start">
                                                            <PhoneForwardedOutlinedIcon />
                                                        </InputAdornment>
                                                    }/>
                                                </Grid>
                                                <Grid item align="center" xs={12} sm={12} md={6}>
                                                    <FormikField name="mobileNumber" label="Mobile" placeholder="Mobile"
                                                    startAdornment={
                                                        <InputAdornment position="start">
                                                            <SmartphoneOutlinedIcon />
                                                        </InputAdornment>
                                                    }/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </CardBody>
                                    <CardFooter className={classes.alignRight}>
                                        {!createUser && <Button color="info" onClick={handleCancelUpdate}>Cancel</Button>}
                                        {createUser ? <Button type="submit" disabled={!isValid || !dirty} color="info">Create Profile</Button> : <Button type="submit" disabled={!isValid || !dirty} color="info">Save Profile</Button>}
                                    </CardFooter>
                                </Card>
                            </form>
                        )}
                    </Formik>
                </GridItem>
            </GridContainer>
        </div>
    );
}