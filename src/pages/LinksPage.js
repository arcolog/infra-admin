import React, { useState } from 'react';
import { Grid } from '@material-ui/core';

import { LIST_TYPES, LIST_TYPE_SOCIAL, SOCIAL_MEDIA_TYPES } from '../constants';
import { fetchMenuListAsync } from '../api';
import DraggableList from '../components/elements/DraggableList';
import LoadingBackdrop from '../components/elements/LoadingBackdrop';

const LinksPage = ({
  channel,
}) => {
  const defaultSocialItems = Object.keys(SOCIAL_MEDIA_TYPES).map((label, priority) => ({ label, url: '', priority }));
  const [socialItems, setSocialItems] = React.useState(defaultSocialItems);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(async () => {
    setIsLoading(true);
    const result = await fetchMenuListAsync({ channel });
    setIsLoading(false);
    if (result[LIST_TYPE_SOCIAL]) {
      setSocialItems(result[LIST_TYPE_SOCIAL]);
    }
  }, []);

  if (isLoading) {
    return <LoadingBackdrop />
  }

  const handleDragEndAsync = (type, items) => {
    setSocialItems(items);
    console.log('handle type', type, items);
  }

  const ItemComponent = ({ item }) => (
    <Grid container justify="space-between" alignItems="center">
      <Grid item>{item.label}</Grid>
      <Grid item>{item.url}</Grid>
    </Grid>
  );

  return (
    <div>
      <h2>{LIST_TYPES[LIST_TYPE_SOCIAL].title}</h2>
      <p>{LIST_TYPES[LIST_TYPE_SOCIAL].description}</p>
      <DraggableList {...{ items: socialItems, ItemComponent, handleDragEndAsync, type: LIST_TYPE_SOCIAL }} />
    </div>
  )
}

export default LinksPage;
