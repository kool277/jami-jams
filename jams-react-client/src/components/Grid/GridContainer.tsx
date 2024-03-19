import { makeStyles } from "@mui/styles";
import Grid, { GridProps } from "@mui/material/Grid";
import { FC, ReactNode } from "react";

const styles = {
  grid: {
    // margin: "0 -15px !important",
    width: "unset",
  },
};

const useStyles = makeStyles(styles as any);

interface GridContainerProps extends GridProps {
  children: ReactNode;
}

const GridContainer: FC<GridContainerProps> = (props) => {
  const classes = useStyles();
  const { children, ...rest } = props;
  return (
    <Grid container {...rest} className={classes.grid}>
      {children}
    </Grid>
  );
};

export default GridContainer;
