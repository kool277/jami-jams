import React from "react";
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @mui/material components
import { makeStyles } from "@mui/styles";
// @mui/icons-material

// core components
import styles from "assets/jss/material-dashboard-react/components/cardBodyStyle";

const useStyles = makeStyles(styles as any);

interface CardBodyProps {
  className?: string;
  plain?: boolean;
  profile: boolean;
  children: React.ReactNode;
}

export default function CardBody(props: CardBodyProps) {
  const classes = useStyles();
  const { className, children, plain, profile, ...rest } = props;
  const cardBodyClasses = classNames({
    [classes.cardBody]: true,
    [classes.cardBodyPlain]: plain,
    [classes.cardBodyProfile]: profile,
    ...(className ? { [className]: true } : {}),
  });
  return (
    <div className={cardBodyClasses} {...rest}>
      {children}
    </div>
  );
}

CardBody.propTypes = {
  className: PropTypes.string,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  children: PropTypes.node,
};
