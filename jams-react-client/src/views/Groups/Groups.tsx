import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
// @mui/material components
import { makeStyles } from "@mui/styles";
// core components
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import Button from "components/CustomButtons/Button";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardFooter from "components/Card/CardFooter";
import CustomInput from "components/CustomInput/CustomInput";

import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Search from "@mui/icons-material/Search";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";

import axios from "axios";
import configApiCall from "api";
import auth from "auth";
import {
  api_path_get_list_group,
  api_path_delete_group,
  api_path_get_group_members,
} from "globalUrls";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import LinearProgress from "@mui/material/LinearProgress";

import i18next from "i18next";

import CreateGroupDialog from "./CreateGroupDialog";

const styles = {
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
  groupsNotFound: {
    marginLeft: "10px",
    display: "flex",
    alignItems: "center",
  },
  whiteButtonText: {
    color: "white",
  },
  inputBottomMargin: {
    marginBottom: "1rem",
  },
};

const useStyles = makeStyles(styles);

export default function Groups() {
  const classes = useStyles();
  const history = useHistory();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zeroGroup, setZeroGroup] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchValue, setSearchValue] = useState(null);

  const [openCreate, setOpenCreate] = useState(false);

  const [removedGroup, setRemovedGroup] = useState({
    id: 0,
    name: "groupeName",
  });
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);

  const handleRemoveGroup = (group) => {
    setRemovedGroup(group);
    setOpenRemoveDialog(true);
  };

  const removeGroup = () => {
    axios(
      configApiCall(
        api_path_delete_group + removedGroup.id,
        "DELETE",
        null,
        null
      )
    )
      .then(() => {
        console.log("Successfully deleted " + removedGroup.name);
        setOpenRemoveDialog(false);
      })
      .catch((error) => {
        console.log("Could not delete " + removedGroup.name + " " + error);
        setOpenRemoveDialog(false);
      });

    history.push("/groups");
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

    axios(configApiCall(api_path_get_list_group, "GET", null, null))
      .then((response) => {
        const allGroups = response.data;

        allGroups.forEach((group) => {
          axios(
            configApiCall(
              api_path_get_group_members + group.id,
              "GET",
              null,
              null
            )
          )
            .then((response) => {
              group["groupMembersLength"] = response.data.length;
            })
            .catch((error) => {
              if (error.response.status === 401) {
                auth.authenticated = false;
                history.push("/");
              }
            });
        });
        setGroups(allGroups);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          auth.authenticated = false;
          history.push("/signin");
        }
        if (error.response.status === 404) {
          setZeroGroup(true);
        }
      });
    return () => {
      clearInterval(timer);
    };
  }, [openCreate, openRemoveDialog, history]);

  if (!auth.hasAdminScope()) {
    return (
      <div>
        <h4>
          {
            i18next.t(
              "you_are_not_allowed_to_access_this_section",
              "You are not allowed to access this section. Please contact your administrator to get administrator privileges."
            ) as string
          }
        </h4>
      </div>
    );
  } else {
    return (
      <div>
        <CreateGroupDialog
          openCreate={openCreate}
          setOpenCreate={setOpenCreate}
          classes={classes}
        />
        <Dialog
          open={openRemoveDialog}
          onClose={() => setOpenRemoveDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {i18next.t("remove_group", "Remove group") as string}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {
                i18next.t(
                  "are_you_sure_you_want_to_delete",
                  "Are you sure you want to delete"
                ) as string
              }{" "}
              <strong>{removedGroup.name}</strong> ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRemoveDialog(false)} color="primary">
              {i18next.t("cancel", "Cancel") as string}
            </Button>
            <Button onClick={removeGroup} color="info" autoFocus>
              {i18next.t("remove", "Remove") as string}
            </Button>
          </DialogActions>
        </Dialog>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            {
              <Button
                variant="contained"
                color="primary"
                href="#contained-buttons"
                onClick={() => setOpenCreate(true)}
              >
                <AddCircleOutlineIcon />{" "}
                {i18next.t("create_group", "Create group") as string}
              </Button>
            }
            <div className={classes.searchWrapper}>
              {!zeroGroup && (
                <CustomInput
                  formControlProps={{
                    className: classes.margin + " " + classes.search,
                  }}
                  inputProps={{
                    placeholder: i18next.t(
                      "search_groups_placeholder",
                      "Search groups…"
                    ),
                    inputProps: {
                      "aria-label": i18next.t(
                        "search_groups",
                        "Search groups"
                      ) as string,
                    },
                    onKeyUp: (e) => setSearchValue(e.target.value),
                  }}
                />
              )}
              {!zeroGroup && <Search />}
              <div className={classes.loading}>
                {!zeroGroup && loading && (
                  <LinearProgress variant="determinate" value={progress} />
                )}
              </div>
            </div>
          </GridItem>
          {zeroGroup ? (
            <div className={classes.groupsNotFound}>
              <InfoIcon />{" "}
              <p style={{ marginLeft: "10px" }}>
                {i18next.t("no_groups_found", "No groups Found") as string}
              </p>
            </div>
          ) : (
            groups
              .filter((data) => {
                if (searchValue === null) {
                  return data;
                } else {
                  return data.name
                    .toLowerCase()
                    .includes(searchValue.toLowerCase());
                }
              })
              .map((group) => (
                <GridItem xs={12} sm={6} md={3} lg={2} xl={2} key={group.name}>
                  <Card profile>
                    <Link to={`/group/${group.id}`}>
                      <CardBody profile>
                        <h3 className={classes.cardTitle}>{group.name}</h3>
                        <ul>
                          <li>
                            <PersonIcon
                              fontSize="small"
                              style={{ marginRight: "10px" }}
                            />
                            <strong style={{ marginRight: "5px" }}>
                              {group.groupMembersLength}
                            </strong>
                            {i18next.t("users", "Users") as string}
                          </li>
                          <li>
                            <MailOutlineIcon
                              fontSize="small"
                              style={{ marginRight: "10px" }}
                            />
                            <strong style={{ marginRight: "5px" }}>
                              {i18next.t("blueprint", "Blueprint") as string}
                            </strong>
                            {group.blueprint}
                          </li>
                        </ul>
                      </CardBody>
                    </Link>
                    <CardFooter>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          handleRemoveGroup(group);
                        }}
                        size="large"
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </CardFooter>
                  </Card>
                </GridItem>
              ))
          )}
        </GridContainer>
      </div>
    );
  }
}
