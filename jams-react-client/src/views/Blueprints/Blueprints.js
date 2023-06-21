import React, { useCallback, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import IconButton from "@material-ui/core/IconButton";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";

import GroupIcon from "@material-ui/icons/Group";
import PersonIcon from "@material-ui/icons/Person";
import Search from "@material-ui/icons/Search";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import InfoIcon from "@material-ui/icons/Info";

import AllInbox from "@material-ui/icons/AllInbox";
import axios from "axios";
import configApiCall from "api.js";
import auth from "auth.js";
import { api_path_blueprints } from "globalUrls";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import LinearProgress from "@material-ui/core/LinearProgress";

import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

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
  blueprintsNotFound: {
    marginLeft: "10px",
    display: "flex",
    alignItems: "center",
  },
  whiteButtonText: {
    color: "white",
  },
};

const useStyles = makeStyles(styles);

export default function Blueprints() {
  const classes = useStyles();
  const history = useHistory();
  const [blueprints, setBlueprints] = useState([]);
  const [selectedBlueprint, setSelectedBlueprint] = useState(false);
  const [selectedBlueprintName, setSelectedBlueprintName] = useState("");
  const [loading, setLoading] = useState(false);
  const [zeroBlueprint, setZeroBlueprint] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchValue, setSearchValue] = useState(false);

  const [blueprintName, setBlueprintName] = useState("");
  const [blueprintNameExits, setBlueprintNameExits] = useState();
  const [open, setOpen] = useState(false);

  const [disableCreate, setDisableCreate] = useState(true);

  const [removedBlueprint, setRemovedBlueprint] = useState("");
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);

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
    axios(configApiCall(api_path_blueprints + "?name=*", "GET", null, null))
      .then((response) => {
        let allBluePrints = response.data;
        if (allBluePrints.length === 0) setZeroBlueprint(true);
        else setZeroBlueprint(false);
        setBlueprints(allBluePrints);
        setLoading(false);
      })
      .catch((error) => {
        setBlueprints([]);
        if (error.response.status === 401) {
          auth.authenticated = false;
          history.push("/");
        }
      });
    return () => {
      clearInterval(timer);
    };
  }, [history, open, openRemoveDialog]);

  function redirectToBlueprint(e, blueprintNameRedirect) {
    e.preventDefault();
    setSelectedBlueprint(true);
    setSelectedBlueprintName(blueprintNameRedirect);
  }

  const handleCheckBlueprintNameExists = (searchBlueprintNameValue) => {
    setDisableCreate(true);
    axios(
      configApiCall(
        api_path_blueprints + "?name=" + searchBlueprintNameValue,
        "GET",
        null,
        null
      )
    )
      .then((response) => {
        setDisableCreate(true);
        setBlueprintNameExits(true);
      })
      .catch((error) => {
        setDisableCreate(false);
        setBlueprintNameExits(false);
      });
  };

  const initCheckBlueprintNameExists = useCallback(
    debounce(
      (searchBlueprintNameValue) =>
        handleCheckBlueprintNameExists(searchBlueprintNameValue),
      500
    ),
    []
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateBlueprint = () => {
    let defaultPolicyData = {
      videoEnabled: true,
      publicInCalls: false,
      allowCertFromContact: true,
      allowCertFromHistory: true,
      allowCertFromTrusted: true,
      autoAnswer: false,
      peerDiscovery: true,
      accountDiscovery: true,
      accountPublish: true,
      rendezVous: false,
      defaultModerators: "",
      upnpEnabled: true,
      allowLookup: true,
    };

    axios(
      configApiCall(
        api_path_blueprints + "?name=" + blueprintName,
        "POST",
        defaultPolicyData,
        null
      )
    )
      .then((response) => {
        setOpen(false);
        setDisableCreate(true);
        setSelectedBlueprintName(blueprintName);
        setSelectedBlueprint(true);
        console.log("Successfully created " + blueprintName);
      })
      .catch((error) => {
        setOpen(false);
        console.log("Could not create " + blueprintName + " " + error);
      });
    history.push(`/blueprint/${blueprintName}`);
  };

  const handleRemoveBlueprint = (blueprintRemovedName) => {
    setRemovedBlueprint(blueprintRemovedName);
    setOpenRemoveDialog(true);
  };

  const removeBlueprint = () => {
    axios(
      configApiCall(
        api_path_blueprints + "?name=" + removedBlueprint,
        "DELETE",
        { queryString: removedBlueprint },
        null
      )
    )
      .then((response) => {
        console.log("Successfully  create " + removedBlueprint);
        setOpenRemoveDialog(false);
      })
      .catch((error) => {
        console.log("Could not create " + removedBlueprint + " " + error);
        setOpenRemoveDialog(false);
      });
    history.push("/blueprints");
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {i18next.t("create_blueprint", "Create blueprint")}
        </DialogTitle>
        <DialogContent>
          <FormControl
            className={classes.margin}
            size="medium"
            error={blueprintNameExits}
          >
            <InputLabel htmlFor="blueprintName">
              {i18next.t("blueprint_name", "Blueprint name")}
            </InputLabel>
            <Input
              id="blueprintName"
              placeholder={i18next.t("blueprint_name", "Blueprint name")}
              startAdornment={
                <InputAdornment position="start">
                  <AllInbox />
                </InputAdornment>
              }
              onChange={(e) => {
                setBlueprintName(e.target.value);
                initCheckBlueprintNameExists(e.target.value);
              }}
            />
          </FormControl>
          {disableCreate && blueprintName.length > 0 && (
            <p>
              {i18next.t(
                "blueprint_name_already_exists",
                "Blueprint name already exists!"
              )}
            </p>
          )}
          {disableCreate && blueprintName.length === 0 && (
            <p>
              {i18next.t("blueprint_name_is_empty", "Blueprint name is empty")}
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {i18next.t("cancel", "Cancel")}
          </Button>
          <Button
            onClick={handleCreateBlueprint}
            color="info"
            className={classes.whiteButtonText}
            disabled={disableCreate}
            autoFocus
          >
            {i18next.t("create_blueprint", "Create blueprint")}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openRemoveDialog}
        onClose={() => setOpenRemoveDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {i18next.t("remove_blueprint", "Remove blueprint")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {i18next.t(
              "are_you_sure_you_want_to_delete",
              "Are you sure you want to delete"
            )}{" "}
            <strong>{removedBlueprint}</strong> ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRemoveDialog(false)} color="primary">
            {i18next.t("cancel", "Cancel")}
          </Button>
          <Button onClick={removeBlueprint} color="info" autoFocus>
            {i18next.t("remove", "Remove")}
          </Button>
        </DialogActions>
      </Dialog>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Button
            variant="contained"
            color="primary"
            href="#contained-buttons"
            onClick={(e) => setOpen(true)}
          >
            <AddCircleOutlineIcon />{" "}
            {i18next.t("create_blueprint", "Create blueprint")}
          </Button>
          <div className={classes.searchWrapper}>
            {!zeroBlueprint && (
              <CustomInput
                formControlProps={{
                  className: classes.margin + " " + classes.search,
                }}
                inputProps={{
                  placeholder: i18next.t(
                    "search_blueprints_placeholder",
                    "Search blueprints…"
                  ),
                  inputProps: {
                    "aria-label": i18next.t(
                      "search_blueprints",
                      "Search blueprints"
                    ),
                  },
                  onKeyUp: (e) => setSearchValue(e.target.value),
                }}
              />
            )}
            {!zeroBlueprint && <Search />}
            <div className={classes.loading}>
              {loading && (
                <LinearProgress variant="determinate" value={progress} />
              )}
            </div>
          </div>
        </GridItem>
        {zeroBlueprint ? (
          <div className={classes.blueprintsNotFound}>
            <InfoIcon />
            <p style={{ marginLeft: "10px" }}>
              {i18next.t("no_blueprints_found", "No blueprints found")}
            </p>
          </div>
        ) : (
          blueprints.map((blueprint) => (
            <GridItem xs={12} sm={6} md={3} lg={2} xl={2} key={blueprint.name}>
              <Card profile>
                <Link to={`/blueprint/${blueprint.name}`}>
                  <CardBody profile>
                    <h3 className={classes.cardTitle}>
                      {blueprint.name
                        ? blueprint.name
                        : i18next.t("no_blueprint_name", "No blueprint name")}
                    </h3>
                    <ul>
                      <li>
                        {JSON.parse(blueprint.policyData).rendezVous ===
                        true ? (
                          <p>
                            <GroupIcon
                              fontSize="small"
                              style={{ marginRight: "10px" }}
                            />
                            {i18next.t("rendezvous", "Rendezvous")}
                          </p>
                        ) : (
                          <p>
                            <PersonIcon
                              fontSize="small"
                              style={{ marginRight: "10px" }}
                            />
                            {i18next.t("standalone", "Standalone")}
                          </p>
                        )}
                      </li>
                    </ul>
                  </CardBody>
                </Link>
                <CardFooter>
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      handleRemoveBlueprint(blueprint.name);
                    }}
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
