import React from "react";
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @mui/material components
import { makeStyles } from "@mui/styles";
// @mui/icons-material
// core components

import styles from "assets/jss/material-dashboard-react/components/cardAvatarStyle";

const useStyles = makeStyles(styles as any);

interface CardAvatarProps {
  children: React.ReactNode;
  className?: string;
  plain?: boolean;
  profile?: boolean;
  displayProfile?: boolean;
  editProfile?: boolean;
}

export default function CardAvatar(props: CardAvatarProps) {
  const classes = useStyles();
  const {
    children,
    className,
    plain,
    profile,
    displayProfile,
    editProfile,
    ...rest
  } = props;
  const cardAvatarClasses = classNames({
    [classes.cardAvatar]: true,
    [classes.cardAvatarProfile]: profile,
    [classes.cardAvatarDisplayProfile]: displayProfile,
    [classes.cardAvatarEditProfile]: editProfile,
    [classes.cardAvatarPlain]: plain,
    ...(className ? { [className]: true } : {}),
  });
  return (
    <div className={cardAvatarClasses} {...rest}>
      {children}
    </div>
  );
}

CardAvatar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  profile: PropTypes.bool,
  displayProfile: PropTypes.bool,
  editProfile: PropTypes.bool,
  plain: PropTypes.bool,
};
