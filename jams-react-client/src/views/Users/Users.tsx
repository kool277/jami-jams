import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
// @mui/material components
import { makeStyles } from "@mui/styles";
import { Pagination } from "@mui/material";
// core components
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button";
import Card from "components/Card/Card";

import CardAvatar from "components/Card/CardAvatar";
import CardBody from "components/Card/CardBody";

import InfoIcon from "@mui/icons-material/Info";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import Search from "@mui/icons-material/Search";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "axios";
import configApiCall from "api";
import auth from "auth";
import { api_path_get_user_directory_search } from "globalUrls";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import jami from "assets/img/faces/jami.png";
import noProfilePicture from "assets/img/faces/no-profile-picture.png";
import LinearProgress from "@mui/material/LinearProgress";
import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle";
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
    wordWrap: "break-word",
  },
};
const useStyles = makeStyles(styles as any);
export default function Users() {
  const classes = useStyles();
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const noUsersFound = users.length === 0;
  const [noMatchFound, setNoMatchFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showRevokedUsers, setShowRevokedUsers] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const [selectedPage, setSelectedPage] = useState(1);

  const [numberPages, setNumberPages] = useState(1);
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
        setUsers(response.data.profiles);
        setNumberPages(response.data.numPages);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 401) {
          auth.authenticated = false;
          history.push("/signin");
        }
      });
    return () => {
      clearInterval(timer);
    };
  }, [history]);

  const searchUsers = (value, page = "1") => {
    setSelectedPage(page);
    setLoading(true);
    setNoMatchFound(false);
    setUsers([]);
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
        setUsers(response.data.profiles);
        setNumberPages(response.data.numPages);
        setNoMatchFound(response.data.profiles.length === 0);
      })
      .catch((error) => {
        setUsers([]);
        setLoading(false);
        if (error.response.status === 401) {
          auth.authenticated = false;
          history.push("/signin");
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
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          {auth.isLocalDirectory() && auth.hasAdminScope() && (
            <Link to={"/createuser"}>
              <Button variant="contained" color="primary">
                <AddCircleOutlineIcon />{" "}
                {i18next.t("create_user", "Create user") as string}
              </Button>
            </Link>
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={showRevokedUsers}
                onChange={() => setShowRevokedUsers(!showRevokedUsers)}
                inputProps={{ "aria-label": "primary checkbox" }}
                color="primary"
              />
            }
            style={{ marginLeft: "1rem" }}
            label="Display revoked users"
          />

          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              {!noUsersFound && (
                <CustomInput
                  formControlProps={{
                    className: classes.margin + " " + classes.search,
                  }}
                  inputProps={{
                    placeholder: i18next.t(
                      "search_users_using",
                      "Search users using (username, first name, last name)"
                    ),
                    inputProps: {
                      "aria-label": i18next.t(
                        "search_users",
                        "Search users"
                      ) as string,
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

              <p style={{ marginLeft: "10px" }}>
                {i18next.t("no_users_found", "No users found") as string}
              </p>
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
              <GridItem xs={12} sm={6} md={3} lg={2} xl={2} key={user.username}>
                <Card profile>
                  <Link to={`/user/${user.username}`}>
                    <CardBody profile>
                      <CardAvatar profile>
                        <img
                          src={
                            user.profilePicture
                              ? "data:image/png;base64, " + user.profilePicture
                              : noProfilePicture
                          }
                          alt="..."
                        />
                      </CardAvatar>

                      <GridContainer
                        container
                        direction="column"
                        justifyContent="flex-end"
                        alignItems="flex-start"
                      >
                        <GridItem style={{ minHeight: "50px" }}>
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
                                style={{
                                  minWidth: "20px",
                                  marginRight: "10px",
                                }}
                              />{" "}
                              {user.username}
                            </li>
                            <li>
                              {user.organization && (
                                <BusinessOutlinedIcon
                                  fontSize="small"
                                  style={{ marginRight: "10px" }}
                                />
                              )}{" "}
                              {user.organization}
                            </li>
                          </ul>
                        </GridItem>
                      </GridContainer>
                    </CardBody>
                  </Link>
                </Card>
              </GridItem>
            ))}
        {noMatchFound && (
          <div className={classes.usersNotFound}>
            <InfoIcon />

            <p style={{ marginLeft: "10px" }}>
              {
                i18next.t(
                  "no_users_found_matching",
                  "No users found matching search value!"
                ) as string
              }
            </p>
          </div>
        )}
      </GridContainer>
    </div>
  );
}
