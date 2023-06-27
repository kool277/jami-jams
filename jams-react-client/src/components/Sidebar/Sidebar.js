import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import UpdateIcon from "@material-ui/icons/Update";

import styles from "assets/jss/material-dashboard-react/components/sidebarStyle.js";

import auth from "auth";

import i18next from "i18next";

const useStyles = makeStyles(styles);

export default function Sidebar(props) {
  const classes = useStyles();
  const mainPanel = React.createRef();
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const handleCloseProfile = () => {
    auth.logout(() => {
      history.push("/");
    });
  };

  useEffect(() => {
    if (auth.isUpdateAvailable() && auth.hasAdminScope()) setOpen(true);
  }, [mainPanel]);

  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return window.location.href.indexOf(routeName) > -1 ? true : false;
  }
  const { color, logo, image, routes } = props;

  var brand = (
    <Link to={"/"}>
      <img src={logo} alt="logo" className={classes.img} />
    </Link>
  );

  var links = (
    <List className={classes.list}>
      <ListItem className={classes.itemLink}>{brand}</ListItem>
      <div className={classes.itemLinkSeparator}>
        <hr />
      </div>
      {routes.map((prop, key) => {
        if (prop.admin && !auth.hasAdminScope()) return null;
        if (!prop.admin && auth.hasAdminScope() && prop.path === "/user/admin")
          return null;

        const listItemClasses = classNames({
          [" " + classes[color]]: activeRoute(prop.layout + prop.path),
        });
        const whiteFontClasses = classNames({
          [" " + classes.whiteFont]: activeRoute(prop.layout + prop.path),
        });

        return (
          <div className={classes.wrapper} key={key}>
            {props.updating && (
              <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={open}
                message={props.snackbarMessage}
                key={"bottomright"}
              ></Snackbar>
            )}

            <Link to={`${prop.path}`}>
              <ListItem button className={classes.itemLink + listItemClasses}>
                {typeof prop.icon === "string" ? (
                  <Icon
                    className={classNames(classes.itemIcon, whiteFontClasses, {
                      [classes.itemIconRTL]: props.rtlActive,
                    })}
                  >
                    {prop.icon}
                  </Icon>
                ) : (
                  <prop.icon
                    className={classNames(classes.itemIcon, whiteFontClasses, {
                      [classes.itemIconRTL]: props.rtlActive,
                    })}
                  />
                )}
                <ListItemText
                  primary={props.rtlActive ? prop.rtlName : prop.name}
                  className={classNames(classes.itemText, whiteFontClasses, {
                    [classes.itemTextRTL]: props.rtlActive,
                  })}
                  disableTypography={true}
                />
              </ListItem>
            </Link>
          </div>
        );
      })}
    </List>
  );

  var bottomLinks = (
    <List className={classes.bottomlist}>
      {open && (
        <ListItem
          button
          className={classes.itemLink}
          onClick={(e) => {
            props.handleQuery();
            props.setOpenUpdate(true);
          }}
        >
          <Icon
            className={classNames(classes.itemIcon, {
              [classes.itemIconRTL]: false,
            })}
          >
            <UpdateIcon />
          </Icon>
          <ListItemText
            primary="Update now"
            className={classNames(classes.itemText, {
              [classes.itemTextRTL]: false,
            })}
            disableTypography={true}
          />
        </ListItem>
      )}

      <ListItem
        button
        className={classes.itemLink}
        onClick={handleCloseProfile}
      >
        <Icon
          className={classNames(classes.itemIcon, {
            [classes.itemIconRTL]: false,
          })}
        >
          <ExitToAppIcon />
        </Icon>
        <ListItemText
          primary={i18next.t("Logout", "Logout")}
          className={classNames(classes.itemText, {
            [classes.itemTextRTL]: false,
          })}
          disableTypography={true}
        />
      </ListItem>
    </List>
  );

  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={props.rtlActive ? "left" : "right"}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
            }),
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <div className={classes.sidebarWrapper}>
            {links}
            {bottomLinks}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor={props.rtlActive ? "right" : "left"}
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
            }),
          }}
        >
          <div className={classes.sidebarWrapper}>{links}</div>
          <div className={classes.sidebarWrapper}>{bottomLinks}</div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
}

Sidebar.propTypes = {
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
};
