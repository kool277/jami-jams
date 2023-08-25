import { FC } from "react";
import * as React from "react";
import { makeStyles } from "@mui/styles";
import { Grid, GridProps } from "@mui/material";

const styles = {
  grid: {
    padding: "0 5px !important",
  },
};

const useStyles = makeStyles(styles as any);

interface GridItemProps extends GridProps {
  children: React.ReactNode;
}

const GridItem: FC<GridItemProps> = ({ children, ...rest }) => {
  const classes = useStyles();
  return (
    <Grid item {...rest} className={classes.grid}>
      {children}
    </Grid>
  );
};

export default GridItem;
