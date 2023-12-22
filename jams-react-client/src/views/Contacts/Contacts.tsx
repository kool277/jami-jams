import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// @mui/material components
import { makeStyles } from "@mui/styles";
// core components
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button";
import Card from "components/Card/Card";
import CardAvatar from "components/Card/CardAvatar";
import CardBody from "components/Card/CardBody";
import CardFooter from "components/Card/CardFooter";

import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import SmsFailedIcon from "@mui/icons-material/SmsFailed";
import LaunchIcon from "@mui/icons-material/Launch";

import Search from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";

import axios from "axios";
import configApiCall from "api";
import auth from "auth";
import {
  api_path_get_auth_contacts,
  api_path_get_admin_contacts,
  api_path_delete_auth_contacts,
  api_path_delete_admin_contacts,
  api_path_get_ns_name_from_addr,
  api_path_get_user_profile,
  api_path_get_user_directory_search,
} from "globalUrls";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import jami from "assets/img/faces/jami.png";
import noProfilePicture from "assets/img/faces/no-profile-picture.png";
import LinearProgress from "@mui/material/LinearProgress";

import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle";
import TemporaryDrawer from "components/Drawer/Drawer";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import i18next from "i18next";
import { Contact } from "../../types/Contact";

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
  actionButtons: {
    height: "3em",
  },
};

const useStyles = makeStyles(styles as any);

export default function Users(props) {
  const classes = useStyles();
  const history = useHistory();
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [removedContact, setRemovedContact] = useState("");
  const [removedContactName, setRemovedContactName] = useState();
  const [open, setOpen] = useState(false);
  const [allowedToAdd, setAllowedToAdd] = useState(true);

  const searchContacts = (value?: string) => {
    axios(
      configApiCall(
        api_path_get_user_directory_search,
        "GET",
        { queryString: value ? value : "*" },
        null
      )
    )
      .then((response) => {
        const profiles = [];
        const profilesResults = response.data.profiles;
        profilesResults.forEach((profile) => {
          if (profile.username !== props.username) {
            let existingContact = false;
            contacts.forEach((contact) => {
              if (profile.username === contact.username) existingContact = true;
            });
            if (!existingContact) profiles.push(profile);
          }
        });
        setUsers(profiles);
      })
      .catch((error) => {
        setUsers([]);
        if (error.response.status === 401) {
          auth.authenticated = false;
          history.push("/signin");
        } else if (error.response.status === 403) {
          setAllowedToAdd(false);
        }
      });
  };

  const getAllContacts = () => {
    let request;

    if (auth.hasAdminScope()) {
      request = axios(
        configApiCall(
          api_path_get_admin_contacts + "?username=" + props.username,
          "GET",
          null,
          null
        )
      );
    } else {
      request = axios(
        configApiCall(api_path_get_auth_contacts, "GET", null, null)
      );
    }

    request
      .then((response) => {
        /*
          TODO: Include the username of the user of which we want to display contacts
          at the moment the admin sees his contacts in each user profile he visits
        */
        const originalContacts = response.data.filter(
          (contact) => contact.added > contact.removed
        );
        for (const contact of originalContacts) {
          contact.display = "";
          axios(
            configApiCall(
              api_path_get_ns_name_from_addr + contact.uri,
              "GET",
              null,
              null
            )
          ).then((response) => {
            contact.username = response.data.name;
            axios(
              configApiCall(
                api_path_get_user_profile + contact.username,
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
        }
        setContacts(originalContacts);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          auth.authenticated = false;
          history.push("/signin");
        }
      });
  };

  const addContactToUser = (value) => {
    const data = {
      owner: props.username,
      uri: value.id,
      displayName: `${value.firstName} ${value.lastName}`,
      timestamp: "",
      status: "",
      banned: false,
      confirmed: false,
    };
    if (auth.hasAdmin()) {
      axios(
        configApiCall(
          api_path_get_admin_contacts + "?username=" + props.username,
          "PUT",
          data,
          null
        )
      )
        .then(() => {
          getAllContacts();
          setOpenDrawer(false);
        })
        .catch((error) => {
          console.log("Error adding user: " + error);
          setOpenDrawer(false);
        });
    } else {
      axios(configApiCall(api_path_get_auth_contacts, "PUT", data, null))
        .then(() => {
          getAllContacts();
          setOpenDrawer(false);
        })
        .catch((error) => {
          console.log("Error adding user: " + error);
          setOpenDrawer(false);
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
    searchContacts();
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
        .then(() => {
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
        .then(() => {
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
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        direction="right"
        placeholder={i18next.t("add_contact", "Add contact…") as string}
        searchTargets={searchContacts}
        targets={users}
        existingTargets={contacts}
        addElementToTarget={addContactToUser}
        type="user"
      />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {i18next.t("remove_contact", "Remove contact") as string}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {
              i18next.t(
                "are_you_sure_you_want_to_remove",
                "Are you sure you want to remove"
              ) as string
            }
            <strong>{" " + removedContactName + " "}</strong>
            {i18next.t("from", "from") as string}
            {" " + props.username + " "}
            {i18next.t("contacts", "contacts") as string}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            {i18next.t("cancel", "Cancel") as string}
          </Button>
          <Button onClick={removeContact} color="info" autoFocus>
            {i18next.t("remove", "Remove") as string}
          </Button>
        </DialogActions>
      </Dialog>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <div className={classes.actionButtons}>
            {allowedToAdd && (
              <Button
                variant="contained"
                color="primary"
                href="#contained-buttons"
                onClick={() => {
                  setOpenDrawer(true);
                }}
              >
                <AddCircleOutlineIcon />{" "}
                {i18next.t("add_a_contact", "Add contact") as string}
              </Button>
            )}
          </div>
          <div className={classes.searchWrapper}>
            <CustomInput
              formControlProps={{
                className: classes.margin + " " + classes.search,
              }}
              inputProps={{
                placeholder: i18next.t(
                  "search_contacts_using",
                  "Search contact fields (URI, firstname, lastname)"
                ),
                inputProps: {
                  "aria-label": i18next.t(
                    "search_contacts",
                    "Search contacts"
                  ) as string,
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
          .filter((data: Contact) => {
            if (searchValue === null) return data;
            else {
              if (
                typeof data.username !== "undefined" &&
                typeof data.firstName !== "undefined" &&
                typeof data.lastName !== "undefined" &&
                typeof data.uri !== "undefined"
              ) {
                return (
                  data.username
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()) ||
                  data.firstName
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()) ||
                  data.lastName
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()) ||
                  data.uri.toLowerCase() === searchValue.toLowerCase()
                );
              } else {
                return data;
              }
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
              {contact.username && (
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
                    <a
                      style={{ float: "right", top: 0 }}
                      href={`/user/${contact.username}`}
                    >
                      <LaunchIcon
                        fontSize="small"
                        style={{
                          marginRight: "10px",
                          color: "black",
                        }}
                      ></LaunchIcon>
                    </a>
                    <h4 className={classes.cardTitle}>
                      {(contact.firstName || contact.lastName) &&
                        `${contact.firstName} ${contact.lastName}`}
                    </h4>
                    <ul>
                      <li style={{ display: "block" }}>
                        {contact.username && (
                          <img
                            src={jami}
                            width="20"
                            alt="Jami"
                            style={{ marginRight: "10px" }}
                          />
                        )}
                        {contact.username && ` ${contact.username}`}
                      </li>
                      <li style={{ display: "block" }}>
                        {contact.organization && (
                          <BusinessOutlinedIcon
                            fontSize="small"
                            style={{ marginRight: "10px" }}
                          />
                        )}
                        {contact.organization && ` ${contact.organization}`}
                      </li>
                      <li style={{ display: "block" }}>
                        {contact.conversationId === null ? (
                          <SmsFailedIcon
                            fontSize="small"
                            style={{ marginRight: "10px" }}
                          ></SmsFailedIcon>
                        ) : (
                          <QuestionAnswerIcon
                            fontSize="small"
                            style={{ marginRight: "10px" }}
                          />
                        )}
                        {contact.conversationId === "null"
                          ? "No conversation id"
                          : `Conversation id: ${contact.conversationId}`}
                      </li>
                    </ul>
                  </CardBody>
                  <CardFooter>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        handleRemoveContact(contact.uri, contact.username);
                      }}
                      size="large"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </CardFooter>
                </Card>
              )}
            </GridItem>
          ))}
        {contacts.length === 0 &&
          ((props.username +
            i18next.t("has_no_contacts", " has no contacts")) as string)}
      </GridContainer>
    </div>
  );
}
