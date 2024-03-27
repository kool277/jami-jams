/*
 * Copyright (C) 2020-2024 by Savoir-faire Linux
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
// @mui/material components
import { makeStyles } from "@mui/styles";
// core components
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button";
import IconButton from "@mui/material/IconButton";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardFooter from "components/Card/CardFooter";

import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import Search from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InfoIcon from "@mui/icons-material/Info";

import axios from "axios";
import configApiCall from "api";
import auth from "auth";
import { api_path_blueprints } from "globalUrls";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import LinearProgress from "@mui/material/LinearProgress";

import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import i18next from "i18next";
import CreateBlueprintDialog from "./CreateBlueprintDialog";

export interface Blueprint {
  name: string;
  policyData: string;
}

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
};

const useStyles = makeStyles(styles as any);

export default function Blueprints() {
  const classes = useStyles();
  const history = useHistory();
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading] = useState(false);
  const [zeroBlueprint, setZeroBlueprint] = useState(false);
  const [progress, setProgress] = useState(0);

  const [open, setOpen] = useState(false);

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
        const allBluePrints = response.data;
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

  const handleRemoveBlueprint = (blueprintRemovedName: string) => {
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
      .then(() => {
        console.log("Successfully created " + removedBlueprint);
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
      <CreateBlueprintDialog open={open} setOpen={setOpen} />
      <Dialog
        open={openRemoveDialog}
        onClose={() => setOpenRemoveDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {i18next.t("remove_blueprint", "Remove blueprint") as string}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {
              i18next.t(
                "are_you_sure_you_want_to_delete",
                "Are you sure you want to delete"
              ) as string
            }
            <strong>{removedBlueprint}</strong> ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRemoveDialog(false)} color="primary">
            {i18next.t("cancel", "Cancel") as string}
          </Button>
          <Button onClick={removeBlueprint} color="info" autoFocus>
            {i18next.t("remove", "Remove") as string}
          </Button>
        </DialogActions>
      </Dialog>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Button
            variant="contained"
            color="primary"
            href="#contained-buttons"
            onClick={() => setOpen(true)}
          >
            <AddCircleOutlineIcon />{" "}
            {i18next.t("create_blueprint", "Create blueprint") as string}
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
              {
                i18next.t(
                  "no_blueprints_found",
                  "No blueprints found"
                ) as string
              }
            </p>
          </div>
        ) : (
          blueprints.map((blueprint: Blueprint) => (
            <GridItem xs={12} sm={6} md={3} lg={2} xl={2} key={blueprint.name}>
              <Card profile>
                <Link to={`/blueprint/${blueprint.name}`}>
                  <CardBody profile>
                    <h3 className={classes.cardTitle}>
                      {blueprint.name
                        ? blueprint.name
                        : (i18next.t(
                            "no_blueprint_name",
                            "No blueprint name"
                          ) as string)}
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
                            {i18next.t("rendezvous", "Rendezvous") as string}
                          </p>
                        ) : (
                          <p>
                            <PersonIcon
                              fontSize="small"
                              style={{ marginRight: "10px" }}
                            />
                            {i18next.t("standalone", "Standalone") as string}
                          </p>
                        )}
                      </li>
                    </ul>
                  </CardBody>
                </Link>
                <CardFooter>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      handleRemoveBlueprint(blueprint.name);
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
