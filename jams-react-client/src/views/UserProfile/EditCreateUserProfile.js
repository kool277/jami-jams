import React from "react";
import { useHistory } from 'react-router-dom';
import {Formik, Field} from "formik";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import Grid from '@material-ui/core/Grid';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
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

    React.useEffect(()=>{
        if(!createUser){
            setUserName(props.username)
            axios(configApiCall(api_path_get_user_directory_search, 'GET', {"queryString": props.username}, null)).then((response) => {
                response.data.map((user) => {
                    setFirstName(user["firstName"])
                    setLastName(user["lastName"])
                    setEmail(user["email"])
                    setProfilePicture(user["profilePicture"])
                    setProfilePicturePreview('data:image/png;base64, ' + user["profilePicture"])
                    setOrganization(user["organization"])
                    setFaxNumber(user["faxNumber"])
                    setPhoneNumber(user["phoneNumber"])
                    setExtension(user["phoneNumberExtension"])
                    setMobileNumber(user["mobileNumber"])
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
        history.push('/admin');
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

    const handleCreateUser = () => {
        const data = {
            'firstName': firstName,
            'lastName': lastName,
            'username': userName,
            'email': email,
            'profilePicture': profilePicture,
            'organization': organization,
            'faxNumber': faxNumber,
            'phoneNumber': phoneNumber,
            'phoneNumberExtension': extension,
            'mobileNumber': mobileNumber,
            'jamiId': ""
        }

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

    const handleUpdateUser = () => {
        const data = {
            'firstName': firstName,
            'lastName': lastName,
            'username': userName,
            'email': email,
            'profilePicture': profilePicture,
            'organization': organization,
            'faxNumber': faxNumber,
            'phoneNumber': phoneNumber,
            'phoneNumberExtension': extension,
            'mobileNumber': mobileNumber
        }

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
        history.push('/admin');
    }

    /**
     * Formik Validation Fields
     *
     * */

    const validateFieldInput = fieldinput => {
        let error;
        if (!fieldinput) {
            error = 'Required';
        }
        return error;
    }

    const validateUsername = usernamevalue => {
        handleUserExists(usernamevalue)
        let error;
        if (!usernamevalue) {
            error = 'Required';
        }
        return error;
    }

    const validateEmail = emailvalue => {
        let error;
        if (!emailvalue) {
            error = 'Required';
        }
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailvalue)) {
            error = 'Invalid email address';
        }
        return error;
    }


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
                    <Button onClick={handleClose} color="danger">
                        Cancel
                    </Button>
                    <Button onClick={cropProfilePicture} color="success" autoFocus>
                        Crop
                    </Button>
                </DialogActions>
            </Dialog>
            <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                    <Formik validateOnBlur
                        initialValues={{
                        username: '',
                        firstname: '',
                        lastname: '',
                        email: '',
                        organization: '',
                        phonenumber: '',
                        extension: '',
                        mobilephonenumber: '',
                        faxnumber: '',

                    }}
                    >
                        {({ errors, touched, validateForm, setFieldTouched}) => (
                            <form>
                                <Card profile>
                                    <CardHeader color="info" stats icon>
                                        <CardIcon color="info">
                                            {createUser ? <PersonAddOutlinedIcon /> : <EditIcon />}
                                        </CardIcon>
                                        <p className={classes.cardCategory}>{createUser ? "Create new profile" : "Edit profile"}</p>
                                        {createUser ? "" : <h3 className={classes.cardTitle}>{userName}</h3>}
                                    </CardHeader>
                                    <CardBody profile>
                                        <div className={classes.root}>
                                            <Grid container spacing={5}>
                                                <Grid item xs={12} sm={12} md={12}>
                                                    <Grid container spacing={5} >
                                                        <Grid item align="center" xs={12} sm={12} md={12} >
                                                            <img src={profilePicturePreview} alt="..." className={classes.editProfilePicture} />
                                                        </Grid>
                                                        <Grid item align="center" xs={12} sm={12} md={12}>
                                                            <input accept="image/*"  className={classes.input} id="icon-button-file" type="file" onChange={handleProfilePictureChange}/>
                                                            <label htmlFor="icon-button-file" >
                                                                <IconButton color="inherit" aria-label="upload picture" component="span" >
                                                                    <PhotoCamera />
                                                                </IconButton> Update profile image
                                                            </label>
                                                        </Grid>
                                                        {createUser &&
                                                        <Grid item align="center" xs={12} sm={12} md={12}>
                                                            <FormControl className={classes.margin} size="medium" error={userExists}>
                                                                <InputLabel htmlFor="username">{userExists ? "Error username exists" : "Username"}</InputLabel>
                                                                <Field name="username" validate={validateUsername} >
                                                                    {({field}) => (
                                                                        <Input
                                                                            id="username"
                                                                            placeholder={userName}
                                                                            startAdornment={
                                                                                <InputAdornment position="start">
                                                                                    <AccountCircleIcon />
                                                                                </InputAdornment>
                                                                            }
                                                                            onChange={setUserName(field.value)}
                                                                            {...field}
                                                                        />
                                                                    )
                                                                    }
                                                                </Field>
                                                                {errors.username && touched.username && <span class="spanError">{errors.username}</span>}
                                                            </FormControl>
                                                        </Grid>
                                                        }
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6}>
                                                    <FormControl className={classes.margin} fullWidth>
                                                        <InputLabel htmlFor="firstname">First Name</InputLabel>
                                                        <Field name="firstname" validate={validateFieldInput} >
                                                            {({field}) => (
                                                                <Input
                                                                    id="firstname"
                                                                    placeholder={firstName}
                                                                    startAdornment={
                                                                        <InputAdornment position="start">
                                                                            <PersonIcon />
                                                                        </InputAdornment>
                                                                    }
                                                                    onChange={setFirstName(field.value)}
                                                                    {...field}
                                                                />
                                                            )
                                                            }
                                                        </Field>
                                                        {errors.firstname && touched.firstname && <span class="spanError">{errors.firstname}</span>}
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6}>
                                                    <FormControl className={classes.margin} fullWidth>
                                                        <InputLabel htmlFor="lastname">Last Name</InputLabel>
                                                        <Field name="lastname" validate={validateFieldInput} >
                                                            {({field}) => (
                                                                <Input
                                                                    id="lastname"
                                                                    placeholder={lastName}
                                                                    startAdornment={
                                                                        <InputAdornment position="start">
                                                                            <PersonOutlinedIcon />
                                                                        </InputAdornment>
                                                                    }
                                                                    onChange={setLastName(field.value)}
                                                                    {...field}
                                                                />
                                                            )
                                                            }
                                                        </Field>
                                                        {errors.lastname && touched.lastname && <span class="spanError">{errors.lastname}</span>}
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6}>
                                                    <FormControl className={classes.margin} fullWidth>
                                                        <InputLabel htmlFor="email">Email</InputLabel>
                                                        <Field name="email" validate={validateEmail} >
                                                            {({field}) => (
                                                                <Input
                                                                    id="email"
                                                                    placeholder={email}
                                                                    startAdornment={
                                                                        <InputAdornment position="start">
                                                                            <AlternateEmailOutlinedIcon />
                                                                        </InputAdornment>
                                                                    }
                                                                    onChange={setEmail(field.value)}
                                                                    {...field}
                                                                />
                                                            )
                                                            }
                                                        </Field>
                                                        {errors.email && touched.email && <span class="spanError">{errors.email}</span>}
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6}>
                                                    <FormControl className={classes.margin} fullWidth>
                                                        <InputLabel htmlFor="organization">Organisation</InputLabel>
                                                        <Field name="organization" validate={validateFieldInput} >
                                                            {({field}) => (
                                                                <Input
                                                                    id="organization"
                                                                    placeholder={organization}
                                                                    startAdornment={
                                                                        <InputAdornment position="start">
                                                                            <BusinessCenterOutlinedIcon />
                                                                        </InputAdornment>
                                                                    }
                                                                    onChange={setOrganization(field.value)}
                                                                    {...field}
                                                                />
                                                            )
                                                            }
                                                        </Field>
                                                        {errors.organization && touched.organization && <span class="spanError">{errors.organization}</span>}
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6}>
                                                    <FormControl className={classes.margin} fullWidth>
                                                        <InputLabel htmlFor="phonenumber">Phone Number</InputLabel>
                                                        <Field name="phonenumber" validate={validateFieldInput} >
                                                            {({field}) => (
                                                                <Input
                                                                    id="phonenumber"
                                                                    placeholder={phoneNumber}
                                                                    startAdornment={
                                                                        <InputAdornment position="start">
                                                                            <PhoneInTalkOutlinedIcon />
                                                                        </InputAdornment>
                                                                    }
                                                                    onChange={setPhoneNumber(field.value)}
                                                                    {...field}
                                                                />
                                                            )
                                                            }
                                                        </Field>
                                                        {errors.phonenumber && touched.phonenumber && <span class="spanError">{errors.phonenumber}</span>}
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6}>
                                                    <FormControl className={classes.margin} fullWidth>
                                                        <InputLabel htmlFor="extension">Extension</InputLabel>
                                                        <Field name="extension" validate={validateFieldInput} >
                                                            {({field}) => (
                                                                <Input
                                                                    id="extension"
                                                                    placeholder={extension}
                                                                    startAdornment={
                                                                        <InputAdornment position="start">
                                                                            <PhoneForwardedOutlinedIcon />
                                                                        </InputAdornment>
                                                                    }
                                                                    onChange={setExtension(field.value)}
                                                                    {...field}
                                                                />
                                                            )
                                                            }
                                                        </Field>
                                                        {errors.extension && touched.extension && <span class="spanError">{errors.extension}</span>}
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6}>
                                                    <FormControl className={classes.margin} fullWidth>
                                                        <InputLabel htmlFor="faxnumber">Fax Number</InputLabel>
                                                        <Field name="faxnumber" validate={validateFieldInput} >
                                                            {({field}) => (
                                                                <Input
                                                                    id="faxnumber"
                                                                    placeholder={faxNumber}
                                                                    startAdornment={
                                                                        <InputAdornment position="start">
                                                                            <LocalPrintshopOutlinedIcon />
                                                                        </InputAdornment>
                                                                    }
                                                                    onChange={setFaxNumber(field.value)}
                                                                    {...field}
                                                                />
                                                            )
                                                            }
                                                        </Field>
                                                        {errors.faxnumber && touched.faxnumber && <span class="spanError">{errors.faxnumber}</span>}
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6}>
                                                    <FormControl className={classes.margin} fullWidth>
                                                        <InputLabel htmlFor="mobilephonenumber">Mobile Phonenumber</InputLabel>
                                                        <Field name="mobilephonenumber" validate={validateFieldInput} >
                                                            {({field}) => (
                                                                <Input
                                                                    id="mobilephonenumber"
                                                                    placeholder={mobileNumber}
                                                                    startAdornment={
                                                                        <InputAdornment position="start">
                                                                            <SmartphoneOutlinedIcon />
                                                                        </InputAdornment>
                                                                    }
                                                                    onChange={setMobileNumber(field.value)}
                                                                    {...field}
                                                                />
                                                            )
                                                            }
                                                        </Field>
                                                        {errors.mobilephonenumber && touched.mobilephonenumber && <span class="spanError">{errors.mobilephonenumber}</span>}
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </CardBody>
                                    <CardFooter>
                                        {createUser ? <Button color="danger" onClick={handleCancel}>Cancel</Button> : <Button color="danger" onClick={handleCancelUpdate}>Cancel Update</Button>}
                                        {createUser ? <Button color="info" onClick={() => validateForm().then(() => handleCreateUser())}>Create Profile</Button> : <Button color="info" onClick={() => validateForm().then(() => handleUpdateUser())}>Update Profile</Button>}
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