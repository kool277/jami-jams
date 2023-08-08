import React, { useCallback } from "react";
import clsx from "clsx";
import { makeStyles } from "@mui/styles";
import CustomInput from "components/CustomInput/CustomInput";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";

import noProfilePicture from "assets/img/faces/no-profile-picture.png";

import { debounce } from "lodash";

const useStyles = makeStyles((theme) => ({
  list: {
    width: "100%",
    [theme.breakpoints.up("xl")]: {
      width: "400px",
    },
  },
  fullList: {
    width: "100%",
    [theme.breakpoints.up("xl")]: {
      width: "400px",
    },
  },
  search: {
    width: "100%",
  },
  margin: {
    marginLeft: "5px",
    marginRight: "5px",
  },
}));

export default function TemporaryDrawer(props) {
  const classes = useStyles();

  const listUsers = () => (
    <List>
      {props.type === "user"
        ? props.targets &&
          props.targets
            .filter(
              (target) =>
                !props.existingTargets.some(
                  (t) => target.username === t.username
                )
            )
            .map((target) => (
              <ListItem
                button
                key={target.username}
                onClick={() => {
                  props.addElementToTarget(target);
                  props.setOpenDrawer(false);
                }}
              >
                <Avatar
                  style={{ marginRight: "10px" }}
                  alt={target.username}
                  src={
                    target.profilePicture
                      ? "data:image/png;base64, " + target.profilePicture
                      : noProfilePicture
                  }
                />
                <ListItemText
                  primary={
                    target.username === ""
                      ? target.id
                      : target.firstName === "" || target.lastName === ""
                      ? target.username
                      : target.firstName + " " + target.lastName
                  }
                />
              </ListItem>
            ))
        : props.targets &&
          props.targets
            .filter(
              (target) =>
                !props.existingTargets.some((t) => target.name === t.name)
            )
            .map((target) => (
              <ListItem
                button
                key={target.name}
                onClick={() => {
                  props.addElementToTarget(target);
                  props.setOpenDrawer(false);
                }}
              >
                <ListItemText primary={target.name} />
              </ListItem>
            ))}
    </List>
  );

  const initSearchTargets = useCallback(
    debounce((searchValue) => props.searchTargets(searchValue), 500),
    []
  );

  const handleSearchTargets = (e) => {
    const searchValue = e.target.value;
    initSearchTargets(searchValue);
  };

  return (
    <div>
      <React.Fragment key={props.direction}>
        <Drawer
          anchor="right"
          open={props.openDrawer}
          onClose={() => {
            props.setOpenDrawer(false);
          }}
        >
          <div
            className={clsx(classes.list, {
              [classes.fullList]:
                props.direction === "top" || props.direction === "bottom",
            })}
            role="presentation"
          >
            <div className={classes.searchWrapper}>
              <CustomInput
                formControlProps={{
                  className: classes.margin + " " + classes.search,
                }}
                inputProps={{
                  placeholder: props.placeholder,
                  inputProps: {
                    "aria-label": props.placeholder,
                  },
                  onKeyUp: handleSearchTargets,
                }}
              />
            </div>
            <Divider />
            {listUsers()}
          </div>
        </Drawer>
      </React.Fragment>
    </div>
  );
}
