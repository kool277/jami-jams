import React, { Fragment, FC, useCallback } from "react";
import clsx from "clsx";
import { debounce } from "lodash";
import { makeStyles } from "@mui/styles";

import {
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemText,
  Avatar,
  Theme,
} from "@mui/material";

import CustomInput from "components/CustomInput/CustomInput";
import noProfilePicture from "assets/img/faces/no-profile-picture.png";

const useStyles = makeStyles((theme: Theme) => ({
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

interface TemporaryDrawerProps {
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  type: "user" | "group";
  targets: any[];
  existingTargets: any[];
  addElementToTarget: (target: any) => void;
  searchTargets: (searchValue: string) => void;
  direction: "top" | "bottom" | "left" | "right";
  placeholder: string;
}

const TemporaryDrawer: FC<TemporaryDrawerProps> = ({
  openDrawer,
  setOpenDrawer,
  type,
  targets,
  existingTargets,
  addElementToTarget,
  searchTargets,
  direction,
  placeholder,
}) => {
  const classes = useStyles();

  const listUsers = () => (
    <List>
      {type === "user"
        ? targets &&
          targets
            .filter(
              (target) =>
                !existingTargets.some((t) => target.username === t.username)
            )
            .map((target) => (
              <ListItem
                button
                key={target.username}
                onClick={() => {
                  addElementToTarget(target);
                  setOpenDrawer(false);
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
        : targets &&
          targets
            .filter(
              (target) => !existingTargets.some((t) => target.name === t.name)
            )
            .map((target) => (
              <ListItem
                button
                key={target.name}
                onClick={() => {
                  addElementToTarget(target);
                  setOpenDrawer(false);
                }}
              >
                <ListItemText primary={target.name} />
              </ListItem>
            ))}
    </List>
  );

  const initSearchTargets = useCallback(debounce(searchTargets, 500), []);

  const handleSearchTargets = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const searchValue = (e.target as HTMLInputElement).value;
    initSearchTargets(searchValue);
  };

  return (
    <div>
      <Fragment key={direction}>
        <Drawer
          anchor="right"
          open={openDrawer}
          onClose={() => {
            setOpenDrawer(false);
          }}
        >
          <div
            className={clsx(classes.list, {
              [classes.fullList]: direction === "top" || direction === "bottom",
            })}
            role="presentation"
          >
            <div>
              <CustomInput
                formControlProps={{
                  className: classes.search,
                }}
                inputProps={{
                  placeholder: placeholder,
                  inputProps: {
                    "aria-label": placeholder,
                  },
                  onKeyUp: handleSearchTargets,
                  inputMarginClass: classes.margin,
                }}
              />
            </div>
            <Divider />
            {listUsers()}
          </div>
        </Drawer>
      </Fragment>
    </div>
  );
};

export default TemporaryDrawer;
