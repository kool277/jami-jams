import React from "react";
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @mui/material components
import { makeStyles } from "@mui/styles";
// @mui/icons-material

// core components
import styles from "assets/jss/material-dashboard-react/components/cardIconStyle";

const useStyles = makeStyles(styles as any);

interface CardIconProps {
  className?: string;
  color?: "warning" | "success" | "danger" | "info" | "primary" | "rose";
  children: React.ReactNode;
}

export default function CardIcon(props: CardIconProps) {
  const classes = useStyles();
  const { className, children, color, ...rest } = props;
  const cardIconClasses = classNames({
    [classes.cardIcon]: true,
    [classes[color + "CardHeader"]]: color,
    ...(className ? { [className]: true } : {}),
  });
  return (
    <div className={cardIconClasses} {...rest}>
      {children}
    </div>
  );
}

CardIcon.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf([
    "warning",
    "success",
    "danger",
    "info",
    "primary",
    "rose",
  ]),
  children: PropTypes.node,
};
