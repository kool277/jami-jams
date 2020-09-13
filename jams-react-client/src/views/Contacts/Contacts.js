import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import BusinessOutlinedIcon from "@material-ui/icons/BusinessOutlined";
import Search from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";

import axios from "axios";
import configApiCall from "api.js";
import auth from "auth.js";
import {
  api_path_get_auth_contacts,
  api_path_get_admin_contacts,
  api_path_delete_auth_contacts,
  api_path_delete_admin_contacts,
  api_path_get_ns_name_from_addr,
  api_path_get_user_profile,
} from "globalUrls";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import jami from "assets/img/faces/jami.png";
import noProfilePicture from "assets/img/faces/no-profile-picture.png";
import LinearProgress from "@material-ui/core/LinearProgress";

import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import TemporaryDrawer from "components/Drawer/Drawer";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const styles = {
  ...headerLinksStyle,
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
  deleteIcon: {
    float: "right",
  },
  search: {
    width: "90%",
  },
  loading: {
    width: "100%",
  },
};

const useStyles = makeStyles(styles);

export default function Users(props) {
  const classes = useStyles();
  const history = useHistory();
  const [contacts, setContacts] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [removedContact, setRemovedContact] = React.useState();
  const [removedContactName, setRemovedContactName] = React.useState();
  const [open, setOpen] = React.useState(false);

  const getAllContacts = () => {
    if (auth.hasAdminScope()) {
      axios(
        configApiCall(
          api_path_get_admin_contacts + "?username=" + props.username,
          "GET",
          null,
          null
        )
      )
        .then((response) => {
          /*
                    TODO: Include the username of the user of witch we want to display contacts
                    at the moment the admin sees his contacts in each user profile he visits
                */
          let orginalContacts = response.data;
          orginalContacts.map((contact) => {
            contact.display = "";
            axios(
              configApiCall(
                api_path_get_ns_name_from_addr + contact.uri,
                null,
                null
              )
            ).then((response) => {
              contact.name = response.data.name;
              axios(
                configApiCall(
                  api_path_get_user_profile + contact.name,
                  "GET",
                  null,
                  null
                )
              ).then((response) => {
                contact.profilePicture = response.data.profilePicture;
                contact.firstName = response.data.firstName;
                contact.lastName = response.data.lastName;
                contact.organization = response.data.organization;
              });
            });
          });
          setContacts(orginalContacts);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 401) {
            auth.authenticated = false;
            history.push("/");
          }
        });
    } else {
      axios(configApiCall(api_path_get_auth_contacts, "GET", null, null))
        .then((response) => {
          /*
                    TODO: Include the username of the user of witch we want to display contacts
                    at the moment the admin sees his contacts in each user profile he visits
                */
          let orginalContacts = response.data;
          orginalContacts.map((contact) => {
            contact.display = "";
            axios(
              configApiCall(
                api_path_get_ns_name_from_addr + contact.uri,
                null,
                null
              )
            ).then((response) => {
              contact.name = response.data.name;
              axios(
                configApiCall(
                  api_path_get_user_profile + contact.name,
                  "GET",
                  null,
                  null
                )
              ).then((response) => {
                contact.profilePicture = response.data.profilePicture;
                contact.firstName = response.data.firstName;
                contact.lastName = response.data.lastName;
                contact.organization = response.data.organization;
              });
            });
          });
          setContacts(orginalContacts);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status == 401) {
            auth.authenticated = false;
            history.push("/");
          }
        });
    }
  };

  useEffect(() => {
    setLoading(true);
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);
    getAllContacts();
    return () => {
      clearInterval(timer);
    };
  }, [openDrawer]);

  const removeContact = () => {
    if (auth.hasAdminScope()) {
      axios(
        configApiCall(
          api_path_delete_admin_contacts +
            "?username=" +
            props.username +
            "&uri=" +
            removedContact.replace("jami://", ""),
          "DELETE",
          null,
          null
        )
      )
        .then((response) => {
          setOpen(false);
          getAllContacts();
        })
        .catch((error) => {
          alert("Uri: " + removedContactName + " was not removed " + error);
        });
    } else {
      axios(
        configApiCall(
          api_path_delete_auth_contacts +
            "?uri=" +
            removedContact.replace("jami://", ""),
          "DELETE",
          null,
          null
        )
      )
        .then((response) => {
          setOpen(false);
          getAllContacts();
        })
        .catch((error) => {
          alert("Uri: " + removedContactName + " was not removed " + error);
        });
    }
  };

  const handleRemoveContact = (uri, name) => {
    setRemovedContact(uri);
    setRemovedContactName(name);
    setOpen(true);
  };

  return (
    <div>
      <TemporaryDrawer
        isAdmin={auth.hasAdminScope()}
        username={props.username}
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        direction="right"
        addingToGroup={false}
        placeholder="Add contact ..."
      />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Remove contact"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove{" "}
            <strong>{removedContactName}</strong> from {props.username} contacts{" "}
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={removeContact} color="info" autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Button
            variant="contained"
            color="primary"
            href="#contained-buttons"
            onClick={() => {
              setOpenDrawer(true);
            }}
          >
            <AddCircleOutlineIcon /> Add a contact
          </Button>
          <div className={classes.searchWrapper}>
            <CustomInput
              formControlProps={{
                className: classes.margin + " " + classes.search,
              }}
              inputProps={{
                placeholder: "Search contacts using (uri, firstname, lastname)",
                inputProps: {
                  "aria-label": "Search contacts",
                },
                onKeyUp: (e) => setSearchValue(e.target.value),
              }}
            />
            <Search />
            <div className={classes.loading}>
              {loading && (
                <LinearProgress variant="determinate" value={progress} />
              )}
            </div>
          </div>
        </GridItem>
        {contacts
          .filter((data) => {
            if (searchValue == null) return data;
            else if (
              data.uri != null &&
              data.uri.toLowerCase().includes(searchValue.toLowerCase())
            ) {
              return data;
            }
          })
          .map((contact) => (
            <GridItem
              xs={12}
              sm={12}
              md={2}
              key={contact.uri}
              style={{ display: contact.display }}
            >
              <Card profile>
                <CardBody profile>
                  <CardAvatar profile>
                    <img
                      src={
                        contact.profilePicture
                          ? "data:image/png;base64, " + contact.profilePicture
                          : noProfilePicture
                      }
                      alt="..."
                    />
                  </CardAvatar>
                  <h4 className={classes.cardTitle}>
                    {contact.firstName} {contact.lastName}
                  </h4>
                  <ul>
                    <li>
                      <img
                        src={jami}
                        width="20"
                        alt="Jami"
                        style={{ marginRight: "10px" }}
                      />{" "}
                      {contact.name ? contact.name : "No name"}
                    </li>
                    <li>
                      <BusinessOutlinedIcon
                        fontSize="small"
                        style={{ marginRight: "10px" }}
                      />{" "}
                      {contact.organization
                        ? contact.organization
                        : "No organization"}
                    </li>
                  </ul>
                </CardBody>
                <CardFooter>
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      handleRemoveContact(contact.uri, contact.name);
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </CardFooter>
              </Card>
            </GridItem>
          ))}
        {contacts == [] && props.username + " has no contacts"}
      </GridContainer>
    </div>
  );
}
