import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

const DraggableList = ({ title, description, items, labelIsEditable = true }) => {
  return (
    <div style={{ maxWidth: 500 }}>
      <h2>{title}</h2>
      <p>{description}</p>
      {items.map(item => (
        <Grid key={item.id} container justify="space-between" alignItems="center">
          <Grid item>{item.label}</Grid>
          <Grid item>{item.url}</Grid>
        </Grid>
      ))}
    </div>
  );
}

DraggableList.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    label: PropTypes.string,
    url: PropTypes.string,
    priority: PropTypes.number,
  })),
}

export default DraggableList;
