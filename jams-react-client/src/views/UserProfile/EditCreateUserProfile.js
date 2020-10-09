import React from "react";
import { useHistory } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";

// core components
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";

import { hexToRgb, blackColor } from "assets/jss/material-dashboard-react.js";

import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import BusinessCenterOutlinedIcon from "@material-ui/icons/BusinessCenterOutlined";
import AlternateEmailOutlinedIcon from "@material-ui/icons/AlternateEmailOutlined";
import PhoneInTalkOutlinedIcon from "@material-ui/icons/PhoneInTalkOutlined";
import PhoneForwardedOutlinedIcon from "@material-ui/icons/PhoneForwardedOutlined";
import SmartphoneOutlinedIcon from "@material-ui/icons/SmartphoneOutlined";
import LocalPrintshopOutlinedIcon from "@material-ui/icons/LocalPrintshopOutlined";
import PersonIcon from "@material-ui/icons/Person";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import RefreshIcon from "@material-ui/icons/Refresh";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import FileCopyIcon from "@material-ui/icons/FileCopy";

import { CopyToClipboard } from "react-copy-to-clipboard";

import Resizer from "react-image-file-resizer";

import noProfilePicture from "assets/img/faces/no-profile-picture.png";

import axios from "axios";
import configApiCall from "../../api";
import {
  api_path_put_update_user_profile,
  api_path_post_create_user,
  api_path_post_create_user_profile,
  api_path_get_user_profile,
  api_path_get_ns_addr_from_name,
} from "../../globalUrls";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

import FormikField from "components/FormikField/FormikField";
import { Formik } from "formik";
import * as Yup from "yup";

import i18next from "i18next";

let generator = require("generate-password");

const fileUpload = require("fuctbase64");

const styles = (theme) => ({
  ...dashboardStyle,
  root: {
    flexGrow: 1,
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  input: {
    display: "none",
  },
  profileAsBackground: {
    backgroundSize: "100% 100%",
    width: "80px",
    height: "80px",
  },
  centerIconMiddle: {
    position: "relative",
    top: "20px",
    left: "15px",
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
    [theme.breakpoints.up("sm")]: {
      minHeight: "60vh",
      minWidth: "80vh",
    },
    width: "100%",
    maxHeight: "60vh",
    maxWidth: "80vh",
  },
  alignRight: {
    float: "right",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
    },
  },
  button: {
    margin: theme.spacing(1),
  },
  cropContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    background: "#333",
    [theme.breakpoints.up("sm")]: {
      height: 400,
    },
  },
  cropButton: {
    flexShrink: 0,
    marginLeft: 16,
  },
  controls: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      alignItems: "center",
    },
  },
  sliderContainer: {
    display: "flex",
    flex: "1",
    alignItems: "center",
  },
  sliderLabel: {
    [theme.breakpoints.down("xs")]: {
      minWidth: 65,
    },
  },
  slider: {
    padding: "22px 0px",
    marginLeft: "10px",
    marginRight: "10px",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      alignItems: "center",
      margin: "0 16px",
    },
  },
});

const useStyles = makeStyles(styles);

export default function EditCreateUserProfile(props) {
  const classes = useStyles();
  const history = useHistory();
  const [createUser, setCreateUser] = React.useState(props.createUser);
  const [copied, setCopied] = React.useState(false);
  const [generated, setGenerated] = React.useState(true);
  const [userExists, setUserExists] = React.useState(false);

  const [userName, setUserName] = React.useState("");

  const [profilePicture, setProfilePicture] = React.useState("");
  const [profilePicturePreview, setProfilePicturePreview] = React.useState(
    noProfilePicture
  );
  const [originalUploadedImage, setOriginalUploadedImage] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [aspect, setAspect] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const passwordGenerator = () => {
    return generator.generate({
      length: 10,
      uppercase: false,
      numbers: true,
      symbols: true,
    });
  };

  const intialyGeneratedPassword = passwordGenerator();

  const initialValues = {
    username: "",
    password: intialyGeneratedPassword,
    confirmPassword: intialyGeneratedPassword,
    firstName: "",
    lastName: "",
    email: "",
    profilePicture: "",
    organization: "",
    faxNumber: "",
    phoneNumber: "",
    phoneNumberExtension: "",
    mobileNumber: "",
    jamiId: "",
  };

  React.useEffect(() => {
    if (!createUser) {
      setUserName(props.username);
      axios(
        configApiCall(
          api_path_get_user_profile + props.username,
          "GET",
          null,
          null
        )
      )
        .then((response) => {
          const user = response.data;
          initialValues.username = user.username;
          initialValues.firstName = user.firstName;
          initialValues.lastName = user.lastName;
          initialValues.email = user.email;
          initialValues.profilePicture = user.profilePicture;
          setProfilePicture(user.profilePicture);
          if (user.profilePicture != "") {
            setProfilePicturePreview(
              "data:image/png;base64, " + user.profilePicture
            );
          } else {
            setProfilePicturePreview(noProfilePicture);
          }

          initialValues.organization = user.organization;
          initialValues.faxNumber = user.faxNumber;
          initialValues.phoneNumber = user.phoneNumber;
          initialValues.phoneNumberExtension = user.phoneNumberExtension;
          initialValues.mobileNumber = user.mobileNumber;
        })
        .catch((error) => {
          console.log("Error fetching user : " + props.username + " " + error);
        });
    }
  }, []);

  const resizeFile = (file, outputFormat) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        512,
        512,
        "PNG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        outputFormat
      );
    });

  const handleProfilePictureChange = (event) => {
    fileUpload(event)
      .then(async (data) => {
        const imageBase64 = await resizeFile(data, "base64");
        setProfilePicture(imageBase64);
        setProfilePicturePreview("data:image/png;base64, " + imageBase64);
        setOriginalUploadedImage(imageBase64);
        setOpen(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancelUpdate = () => {
    props.setDisplayUser(true);
  };

  const handleUserProfileCreation = (data) => {
    axios(configApiCall(api_path_post_create_user_profile, "POST", data, null))
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
        console.log("Error creating user profile: " + error);
      });
  };

  const handleCreateUser = (data) => {
    data.username = data.username.toLowerCase();
    const body = {
      username: data.username,
      password: data.password,
    };

    axios(configApiCall(api_path_post_create_user, "POST", body, null))
      .then((response) => {
        handleUserProfileCreation(data);
      })
      .catch((error) => {
        console.log(
          "Failed to create new user. This is either because the username is already in use" +
            " on the public nameserver, or another unknown error has occurred. " +
            "Please choose another one."
        );
      });
  };

  const handleUserUpdate = () => {
    props.setDisplayUser(true);
  };

  const handleUpdateUser = (data) => {
    axios(configApiCall(api_path_put_update_user_profile, "PUT", data, null))
      .then((response) => {
        handleUserUpdate();
      })
      .catch((error) => {
        console.log("Error updating user: " + error);
      });
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    getCroppedImg(originalUploadedImage, croppedAreaPixels, rotation).then(
      (value) => {
        setProfilePicturePreview(value);
      }
    );
  };

  const handleClose = () => {
    setProfilePicturePreview(originalUploadedImage);
    setOpen(false);
  };

  const cropProfilePicture = () => {
    setProfilePicture(
      profilePicturePreview.replace("data:image/jpeg;base64,", "")
    );
    setOpen(false);
  };

  const handleFormikSubmit = (values) => {
    values.profilePicture = profilePicture;
    if (createUser) {
      handleCreateUser(values);
    } else {
      handleUpdateUser(values);
    }
  };

  const handleMouseDownPassword = () => {
    setPasswordVisible(true);
  };
  const handleMouseUpPassword = () => {
    setPasswordVisible(false);
  };

  const checkUserExists = async (value) => {
    const data = {
      username: value,
    };

    const userExsits = await axios(
      configApiCall(
        api_path_get_ns_addr_from_name + data.username,
        "GET",
        null,
        null
      )
    )
      .then((response) => {
        if (response.status === 200) {
          return true;
        }
        return false;
      })
      .catch((error) => {
        console.log("Error checking for existing users: " + error);
        return false;
      });

    setUserExists(userExsits);
  };

  const EditCreateSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, i18next.t("minimum_3_characters", "Minimum 3 characters!"))
      .max(32, i18next.t("maximum_32_characters", "Maximum 32 characters!"))
      .required(i18next.t("username_is_required", "Username is required!"))
      .matches(/^[A-Za-z_][A-Za-z0-9_]*$/, i18next.t("only_alphanumeric_characters", "Only alphanumeric characters!")),
    password: createUser
      ? Yup.string().required(i18next.t("only_alphanumeric_characters", "Password is required!"))
      : null,
    confirmPassword: createUser
      ? Yup.string().oneOf([Yup.ref("password"), null], i18next.t("password_must_match", "Passwords must match"))
      : null,
    firstName: Yup.string().min(2, i18next.t("first_name_is_too_short", "First name is too short!")),
    lastName: Yup.string().min(2, i18next.t("last_name_is_too_short", "Last Name is too short!")),
    email: Yup.string().email(i18next.t("invalid_email", "Invalid email!")),
    profilePicture: Yup.string(),
    organization: Yup.string().min(2, i18next.t("organization_name_too_short", "Organization name is too short!")),
    faxNumber: Yup.string().matches(
      /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      i18next.t("fax_not_valid", "Fax not valid!")
    ),
    phoneNumber: Yup.string().matches(
      /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      i18next.t("phone_not_valid", "Phone not valid!")
    ),
    phoneNumberExtension: Yup.number().positive().integer(),
    mobileNumber: Yup.string().matches(
      /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      i18next.t("mobile_not_valid", "Mobile not valid!")
    ),
  });

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle id="alert-dialog-title">{i18next.t("crop_image", "Crop image")}</DialogTitle>
        <DialogContent>
          <div className={classes.cropContainer}>
            <Cropper
              image={originalUploadedImage}
              cropSize={{ width: 300, height: 300 }}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className={classes.controls}>
            <div className={classes.sliderContainer}>
              <Typography
                variant="overline"
                classes={{ root: classes.sliderLabel }}
              >
                {i18next.t("zoom", "Zoom")}
              </Typography>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                className={classes.slider}
                onChange={(e, zoom) => setZoom(zoom)}
              />
            </div>
            <div className={classes.sliderContainer}>
              <Typography
                variant="overline"
                classes={{ root: classes.sliderLabel }}
              >
                {i18next.t("rotation", "Rotation")}
              </Typography>
              <Slider
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-labelledby="Rotation"
                className={classes.slider}
                onChange={(e, rotation) => setRotation(rotation)}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="info">
            {i18next.t("cancel", "Cancel")}
          </Button>
          <Button onClick={cropProfilePicture} color="success" autoFocus>
            {i18next.t("crop", "Crop")}
          </Button>
        </DialogActions>
      </Dialog>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Formik
            initialValues={initialValues}
            onSubmit={handleFormikSubmit}
            validationSchema={EditCreateSchema}
          >
            {({ isValid, dirty, handleSubmit, setFieldValue, values }) => (
              <form onSubmit={handleSubmit}>
                <Card profile>
                  <CardHeader color="info" stats icon>
                    <p className={classes.cardCategory}>
                      {createUser ? i18next.t("create_new_profile", "Create new profile") : i18next.t("edit_profile", "Edit profile")}
                    </p>
                    {createUser ? (
                      ""
                    ) : (
                      <h3 className={classes.cardTitle}>{userName}</h3>
                    )}
                  </CardHeader>
                  <CardBody profile>
                    <CardAvatar editProfile>
                      <img
                        src={profilePicturePreview}
                        alt="..."
                        className={classes.editProfilePicture}
                        onClick={() => {
                          let pictureChange = document.getElementById(
                            "change-profile-picture"
                          );
                          pictureChange.click();
                        }}
                      />
                    </CardAvatar>
                    <div className={classes.root}>
                      <Grid container spacing={5}>
                        <Grid item xs={12} sm={12} md={12}>
                          <input
                            accept="image/*"
                            className={classes.input}
                            id="icon-button-file"
                            type="file"
                            onChange={handleProfilePictureChange}
                          />
                          <label htmlFor="icon-button-file">
                            <IconButton
                              id="change-profile-picture"
                              color="info"
                              aria-label="upload picture"
                              component="span"
                            >
                              <PhotoCamera />
                            </IconButton>{" "}
                            {i18next.t("change_profile_image", "Change profile image")}
                          </label>
                        </Grid>
                        {createUser && (
                          <Grid item xs={12} sm={12} md={6}>
                            <FormikField
                              name="username"
                              label={i18next.t("username", "Username")}
                              placeholder={i18next.t("username", "Username")}
                              startAdornment={
                                <InputAdornment position="start">
                                  <AccountCircleIcon />
                                </InputAdornment>
                              }
                              endAdornment={
                                values.username === "" ? (
                                  ""
                                ) : userExists ? (
                                  <CancelIcon style={{ color: "#cc0000" }} />
                                ) : (
                                  <CheckCircleIcon
                                    style={{ color: "#99cc00" }}
                                  />
                                )
                              }
                              required
                              autoComplete="off"
                              handleChange={checkUserExists}
                              onKeyUpError={userExists}
                              onKeyUpErrorMessage={i18next.t("username_already_taken", "Username already taken")}
                            />
                          </Grid>
                        )}
                        {createUser && (
                          <Grid item xs={12} sm={12} md={6}></Grid>
                        )}
                        {createUser && (
                          <Grid item xs={12} sm={12} md={6}>
                            <FormikField
                              type={passwordVisible ? "text" : "password"}
                              name="password"
                              label={i18next.t("password", "Password")}
                              placeholder={i18next.t("password", "Password")}
                              startAdornment={
                                <InputAdornment position="start">
                                  <VpnKeyIcon />
                                </InputAdornment>
                              }
                              endAdornment={
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onMouseDown={handleMouseDownPassword}
                                  onMouseUp={handleMouseUpPassword}
                                >
                                  {passwordVisible ? (
                                    <VisibilityIcon />
                                  ) : (
                                    <VisibilityOffIcon />
                                  )}
                                </IconButton>
                              }
                              required
                              autoComplete="off"
                            />
                          </Grid>
                        )}
                        {createUser && (
                          <Grid item xs={12} sm={12} md={6}>
                            <FormikField
                              type={passwordVisible ? "text" : "password"}
                              name="confirmPassword"
                              label={i18next.t("confirm_password", "Confirm Password")}
                              placeholder={i18next.t("confirm_password", "Confirm Password")}
                              startAdornment={
                                <InputAdornment position="start">
                                  <VpnKeyIcon />
                                </InputAdornment>
                              }
                              endAdornment={
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onMouseDown={handleMouseDownPassword}
                                  onMouseUp={handleMouseUpPassword}
                                >
                                  {passwordVisible ? (
                                    <VisibilityIcon />
                                  ) : (
                                    <VisibilityOffIcon />
                                  )}
                                </IconButton>
                              }
                              required
                              autoComplete="off"
                            />
                          </Grid>
                        )}
                        {createUser && (
                          <Grid item align="left" xs={12} sm={12} md={6}></Grid>
                        )}
                        {createUser && (
                          <Grid item align="left" xs={12} sm={12} md={6}>
                            <Button
                              variant="contained"
                              color="primary"
                              size="large"
                              className={classes.button}
                              startIcon={<RefreshIcon />}
                              onClick={() => {
                                const newGeneratedPassword = passwordGenerator();
                                setFieldValue(
                                  "password",
                                  newGeneratedPassword,
                                  false
                                );
                                setFieldValue(
                                  "confirmPassword",
                                  newGeneratedPassword,
                                  false
                                );
                                setCopied(false);
                                setGenerated(true);
                              }}
                            >
                              {i18next.t("generate", "Generate")}
                            </Button>
                            <CopyToClipboard
                              text={values.password}
                              onCopy={() => {
                                setCopied(true);
                                setGenerated(false);
                              }}
                            >
                              <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                className={classes.button}
                                startIcon={<FileCopyIcon />}
                              >
                                {i18next.t("copy_to_clipboard", "Copy to clipboard")}
                              </Button>
                            </CopyToClipboard>
                            {copied ? (
                              <span style={{ marginLeft: "10px" }}>{i18next.t("copied", "Copied")}</span>
                            ) : null}
                            {generated ? (
                              <span style={{ marginLeft: "10px" }}>
                                {i18next.t("generated", "Generated")}
                              </span>
                            ) : null}
                          </Grid>
                        )}
                        <Grid item align="center" xs={12} sm={12} md={6}>
                          <FormikField
                            name="firstName"
                            label={i18next.t("first_name", "First name")}
                            placeholder={i18next.t("first_name", "First name")}
                            startAdornment={
                              <InputAdornment position="start">
                                <PersonIcon />
                              </InputAdornment>
                            }
                          />
                        </Grid>
                        <Grid item align="center" xs={12} sm={12} md={6}>
                          <FormikField
                            name="lastName"
                            label={i18next.t("last_name", "Last name")}
                            placeholder={i18next.t("last_name", "Last name")}
                            startAdornment={
                              <InputAdornment position="start">
                                <PersonOutlinedIcon />
                              </InputAdornment>
                            }
                          />
                        </Grid>
                        <Grid item align="center" xs={12} sm={12} md={6}>
                          <FormikField
                            name="email"
                            label={i18next.t("email", "Email")}
                            placeholder={i18next.t("email", "Email")}
                            startAdornment={
                              <InputAdornment position="start">
                                <AlternateEmailOutlinedIcon />
                              </InputAdornment>
                            }
                          />
                        </Grid>
                        <Grid item align="center" xs={12} sm={12} md={6}>
                          <FormikField
                            name="organization"
                            label={i18next.t("organization", "Organization")}
                            placeholder={i18next.t("organization", "Organization")}
                            startAdornment={
                              <InputAdornment position="start">
                                <BusinessCenterOutlinedIcon />
                              </InputAdornment>
                            }
                          />
                        </Grid>
                        <Grid item align="center" xs={12} sm={12} md={6}>
                          <FormikField
                            name="faxNumber"
                            label={i18next.t("fax_number", "Fax number")}
                            placeholder={i18next.t("fax_number", "Fax number")}
                            startAdornment={
                              <InputAdornment position="start">
                                <LocalPrintshopOutlinedIcon />
                              </InputAdornment>
                            }
                          />
                        </Grid>
                        <Grid item align="center" xs={12} sm={12} md={6}>
                          <FormikField
                            name="phoneNumber"
                            label={i18next.t("phone_number", "Phone number")}
                            placeholder={i18next.t("phone_number", "Phone number")}
                            startAdornment={
                              <InputAdornment position="start">
                                <PhoneInTalkOutlinedIcon />
                              </InputAdornment>
                            }
                          />
                        </Grid>
                        <Grid item align="center" xs={12} sm={12} md={6}>
                          <FormikField
                            name="phoneNumberExtension"
                            label={i18next.t("extension", "Extension")}
                            placeholder={i18next.t("extension", "Extension")}
                            startAdornment={
                              <InputAdornment position="start">
                                <PhoneForwardedOutlinedIcon />
                              </InputAdornment>
                            }
                          />
                        </Grid>
                        <Grid item align="center" xs={12} sm={12} md={6}>
                          <FormikField
                            name="mobileNumber"
                            label={i18next.t("mobile", "Mobile")}
                            placeholder={i18next.t("mobile", "Mobile")}
                            startAdornment={
                              <InputAdornment position="start">
                                <SmartphoneOutlinedIcon />
                              </InputAdornment>
                            }
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </CardBody>
                  <CardFooter className={classes.alignRight}>
                    {!createUser && (
                      <Button color="info" onClick={handleCancelUpdate}>
                        {i18next.t("cancel", "Cancel")}
                      </Button>
                    )}
                    {createUser ? (
                      <Button
                        type="submit"
                        disabled={!isValid || !dirty || userExists}
                        color="info"
                      >
                        {i18next.t("create_profile", "Create Profile")}
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={!isValid || !dirty}
                        color="info"
                      >
                        {i18next.t("save_profile", "Save Profile")}
                      </Button>
                    )}
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
