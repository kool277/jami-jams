import { FC, ReactNode } from "react";
import classNames from "classnames";

import Button, { ButtonProps } from "@mui/material/Button";
import { makeStyles } from "@mui/styles";

import styles from "assets/jss/material-dashboard-react/components/buttonStyle";

const useStyles = makeStyles(styles as any);

interface RegularButtonProps extends ButtonProps {
  size?: "small" | "large";
  simple?: boolean;
  round?: boolean;
  disabled?: boolean;
  block?: boolean;
  link?: boolean;
  justIcon?: boolean;
  className?: string;
  children?: ReactNode;
}

const RegularButton: FC<RegularButtonProps> = (props) => {
  const classes = useStyles();
  const {
    color,
    round,
    children,
    disabled,
    simple,
    size,
    block,
    link,
    justIcon,
    className,
    ...rest
  } = props;
  const btnClasses = classNames({
    [classes.button]: true,
    [classes[size]]: size,
    [classes[color]]: color,
    [classes.round]: round,
    [classes.disabled]: disabled,
    [classes.simple]: simple,
    [classes.block]: block,
    [classes.link]: link,
    [classes.justIcon]: justIcon,
    [className]: className,
  });
  return (
    <Button {...rest} className={btnClasses}>
      {children}
    </Button>
  );
};

export default RegularButton;
