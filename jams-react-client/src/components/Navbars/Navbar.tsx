import classNames from "classnames";
import PropTypes from "prop-types";
// @mui/material components
import { makeStyles } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Hidden from "@mui/material/Hidden";
// @mui/icons-material
import Menu from "@mui/icons-material/Menu";
// core components
import Button from "components/CustomButtons/Button";

import styles from "assets/jss/material-dashboard-react/components/headerStyle";
import { Route } from "layouts/BaseLayout";

const useStyles = makeStyles(styles as any);

interface HeaderProps {
  // color: "primary" | "info" | "success" | "warning" | "danger";
  // rtlActive: boolean;
  handleDrawerToggle: () => void;
  routes: Route[];
}

export default function Header(props: HeaderProps) {
  const classes = useStyles();
  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          <Button color="info" className={classes.title}></Button>
        </div>
        <Hidden mdUp implementation="css">
          <IconButton
            color="default"
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
            size="large"
          >
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  routes: PropTypes.arrayOf(PropTypes.object),
};
