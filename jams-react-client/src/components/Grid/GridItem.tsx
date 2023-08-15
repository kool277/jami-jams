import React, { FC } from "react";
import { makeStyles } from "@mui/styles";
import { Grid, GridTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

const styles = {
  grid: {
    padding: "0 5px !important",
  },
};

const useStyles = makeStyles(styles);

interface GridItemProps extends OverridableComponent<GridTypeMap> {
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
