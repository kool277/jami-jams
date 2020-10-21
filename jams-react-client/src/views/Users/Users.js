import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Switch, Route, Redirect } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import Pagination from "@material-ui/lab/Pagination";
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
import UserProfile from "views/UserProfile/UserProfile.js";
import Divider from "@material-ui/core/Divider";
import PersonIcon from "@material-ui/icons/Person";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import PhoneOutlinedIcon from "@material-ui/icons/PhoneOutlined";
import InfoIcon from "@material-ui/icons/Info";
import BusinessOutlinedIcon from "@material-ui/icons/BusinessOutlined";
import Search from "@material-ui/icons/Search";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import axios from "axios";
import configApiCall from "api.js";
import auth from "auth.js";
import { api_path_get_user_directory_search } from "globalUrls";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturn";
import jami from "assets/img/faces/jami.png";
import noProfilePicture from "assets/img/faces/no-profile-picture.png";
import EditCreateUserProfile from "views/UserProfile/EditCreateUserProfile";
import LinearProgress from "@material-ui/core/LinearProgress";
import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import { debounce } from "lodash";

import i18next from "i18next";

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
  usersNotFound: {
    marginLeft: "10px",
    display: "flex",
    alignItems: "center",
  },
  cardBodyContent: {

    wordWrap: "break-word"
  }  
};
const useStyles = makeStyles(styles);
export default function Users(props) {
  const classes = useStyles();
  const history = useHistory();
  const [users, setUsers] = React.useState([]);
  const [noUsersFound, setNoUsersFound] = React.useState(false);
  const [noMatchFound, setNoMatchFound] = React.useState(false);
  const [selectedUsername, setSelectedUsername] = React.useState("");
  const [createUser, setCreateUser] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const [searchValue, setSearchValue] = React.useState("");

  const [selectedPage, setSelectedPage] = React.useState(1);

  const [numberPages, setNumberPages] = React.useState(1);
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
    axios(
      configApiCall(
        api_path_get_user_directory_search,
        "GET",
        { queryString: "*", page: "1" },
        null
      )
    )
      .then((response) => {
        if (response.status != 204) {
          setUsers(response.data.profiles);

          setNumberPages(response.data.numPages);
        } else {
          setNoUsersFound(true);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status == 401) {
          auth.authenticated = false;
          history.push("/");
        }
      });
    return () => {
      clearInterval(timer);
    };
  }, []);
  const [selectedProfile, setSelectedProfile] = useState(false);
  const redirectToUserProfile = (e, username) => {
    e.preventDefault();
    setSelectedProfile(true);
    setSelectedUsername(username);
  };
  const searchUsers = (value, page = "1") => {
    setSelectedPage(page);
    setLoading(true);
    setNoMatchFound(false);
    setUsers([]);
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);
    axios(
      configApiCall(
        api_path_get_user_directory_search,
        "GET",
        { queryString: value ? value : "*", page: page },
        null
      )
    )
      .then((response) => {
        setLoading(false);
        if (response.status != 204) {
          setUsers(response.data.profiles);
          setNumberPages(response.data.numPages);
        } else {
          setNoMatchFound(true);
        }
      })
      .catch((error) => {
        console.log(error);
        setUsers([]);

        setNoMatchFound(true);
        if (error.response.status == 401) {
          auth.authenticated = false;
          history.push("/");
        }
      });
  };
  const initSearchUsers = useCallback(
    debounce((value) => searchUsers(value), 500),
    []
  );
  const handleSearchUsers = (e) => {
    setSearchValue(e.target.value);
    initSearchUsers(e.target.value);
  };

  const handleChangePage = (e, page) => {
    searchUsers(searchValue, page);
  };
  if (!auth.hasAdminScope() && auth.getUsername() != "") {
    return (
      <div>
        <UserProfile username={auth.getUsername()} />
      </div>
    );
  } else if (selectedProfile && auth.hasAdminScope() && selectedUsername != "") {
    return (
      <div>
        <UserProfile username={selectedUsername} />
      </div>
    );
  } else if (createUser) {
    return (
      <EditCreateUserProfile
        createUser={createUser}
        setCreateUser={setCreateUser}
        setError={props.setError}
        setErrorMessage={props.setErrorMessage}
        setSeverity={props.setSeverity}
      />
    );
  } else {
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            {auth.isLocalDirectory() && (
              <Button
                variant="contained"
                color="primary"
                href="#contained-buttons"
                onClick={(e) => setCreateUser(true)}
              >
                <AddCircleOutlineIcon />{" "}
                {i18next.t("create_user", "Create user")}
              </Button>
            )}
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                {!noUsersFound && (
                  <CustomInput
                    formControlProps={{
                      className: classes.margin + " " + classes.search,
                    }}
                    inputProps={{
                      placeholder:
                      i18next.t("search_users_using", "Search users using (username, first name, last name)"),
                      inputProps: {
                        "aria-label": i18next.t("search_users", "Search users"),
                      },
                      onKeyUp: handleSearchUsers,
                    }}
                  />
                )}
                {!noUsersFound && <Search />}
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                {!noUsersFound && (
                  <Pagination
                    count={numberPages}
                    page={selectedPage}
                    onChange={handleChangePage}
                  />
                )}
              </GridItem>
            </GridContainer>

            <div className={classes.loading}>
              {loading && (
                <LinearProgress variant="determinate" value={progress} />
              )}
            </div>

            {noUsersFound && (
              <div className={classes.usersNotFound}>
                <InfoIcon />

            <p style={{ marginLeft: "10px" }}>{i18next.t("no_users_found", "No users found")}</p>
              </div>
            )}
          </GridItem>
          {(!noUsersFound || !noMatchFound) &&
            users
              .sort(function (a, b) {
                if (a.username < b.username) {
                  return -1;
                }
                if (a.username > b.username) {
                  return 1;
                }
                return 0;
              })
              .map((user) => (
                <GridItem
                  xs={12}
                  sm={6}
                  md={3}
                  lg={2}
                  xl={2}
                  
                  key={user.username}
                >
                  <Card profile>
                      <a
                        href="#"
                        onClick={(e) => redirectToUserProfile(e, user.username)}
                      >
                      <CardBody profile>
                        <CardAvatar profile>
                          <img
                            src={
                              user.profilePicture
                                ? "data:image/png;base64, " +
                                  user.profilePicture
                                : noProfilePicture
                            }
                            alt="..."
                          />
                        </CardAvatar>
                        
                        <GridContainer
                            container
                            direction="column"
                            justify="flex-end"
                            alignItems="flex-start"
                          >
                          <GridItem style={{ minHeight:"50px"}}>
                              <h4 className={classes.cardTitle}>
                              {`${user.firstName} ${user.lastName}`}
                            </h4>
                          </GridItem>
                          <GridItem>
                            <ul className={classes.cardBodyContent}>
                            <li>
                              <img
                                src={jami}
                                width="20px"
                                alt="Jami"
                                style={{ minWidth:"20px", marginRight: "10px" }}
                              />{" "}
                              {user.username}
                            </li>
                            <li>
                              {user.organization && <BusinessOutlinedIcon
                                fontSize="small"
                                style={{ marginRight: "10px" }}
                              />}{" "}
                              {user.organization}
                            </li>
                          </ul>
                          </GridItem>
                        </GridContainer>
                        </CardBody>
                      </a>
                  </Card>
                </GridItem>
              ))}
          {noMatchFound && (
            <div className={classes.usersNotFound}>
              <InfoIcon />

              <p style={{ marginLeft: "10px" }}>
                  {i18next.t("no_users_found_matching", "No users found matching search value!")}
              </p>
            </div>
          )}
        </GridContainer>
      </div>
    );
  }
}
