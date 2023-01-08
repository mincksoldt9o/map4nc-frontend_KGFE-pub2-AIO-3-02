import React from 'react';
import { Grid, GridDirection, GridJustification, GridWrap, Box, GridItemsAlignment } from '@material-ui/core';

type CustomGridProps = {
  children: React.ReactNode | React.ReactNode[];
  direction?: GridDirection;
  justify?: GridJustification;
  wrap?: GridWrap;
  alignItems?: GridItemsAlignment | undefined;
  itemSpace?: any;
};

const CustomGrid: React.FC<CustomGridProps> = (props: CustomGridProps) => {
  const { children, direction, justify = 'flex-start', itemSpace = 1, wrap, alignItems } = props;
  return (
    <Grid container direction={direction} justify={justify} wrap={wrap} alignItems={alignItems}>
      {Array.isArray(children) ? (
        children.map((child) => (
          <Grid item>
            <Box ml={itemSpace}>{child}</Box>
          </Grid>
        ))
      ) : (
        <Grid item>
          <Box ml={itemSpace}>{children}</Box>
        </Grid>
      )}
    </Grid>
  );
};

export default CustomGrid;
