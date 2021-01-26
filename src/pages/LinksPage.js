import React, { useState } from 'react';
import { Divider, Grid } from '@material-ui/core';

import {
  LIST_TYPES,
  LIST_TYPE_SOCIAL,
  LIST_TYPE_FOOTER,
  LIST_TYPE_NOTIFICATION,
  SOCIAL_MEDIA_TYPES,
} from '../constants';
import { fetchMenuListAsync, saveMenuOrderAsync } from '../api';
import DraggableList from '../components/elements/DraggableList';
import LoadingBackdrop from '../components/elements/LoadingBackdrop';
import SocialMediaIcon from '../components/elements/SocialMediaIcon';

const DEFAULT_ITEM = { label: '', url: '', priority: 0, id: null };
const DEFAULT_ITEMS_BY_TYPE = {
    // by default show all possible items, even when they are not saved
  [LIST_TYPE_SOCIAL]: Object.keys(SOCIAL_MEDIA_TYPES)
    .map((label, priority) => ({ label, url: '', priority })),
  [LIST_TYPE_FOOTER]: [],
  [LIST_TYPE_NOTIFICATION]: [],
};

const LinksPage = ({
  channel,
}) => {
  const [itemsByType, setItemsByType] = React.useState(DEFAULT_ITEMS_BY_TYPE);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(async () => {
    setIsLoading(true);
    const updatedItemsByType = (await fetchMenuListAsync({ channel })).data.data;
    // add missing social media items
    const type = LIST_TYPE_SOCIAL;
    const existingSocialTypes = updatedItemsByType[type].map(item => item.label);
    for (const socialType of Object.keys(SOCIAL_MEDIA_TYPES)) {
      if (existingSocialTypes.indexOf(socialType) < 0) {
        updatedItemsByType[type].push({
          channel, type, label: socialType, url: '', priority: updatedItemsByType[type].length
        });
      }
    }
    setItemsByType(updatedItemsByType);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingBackdrop />
  }

  const handleDragEndAsync = async (type, items) => {
    setItemsByType(prevState => ({ ...prevState, [type]: items }));
    await saveMenuOrderAsync({ channel, data: items });
  }

  const ItemComponent = ({ item, type }) => (
    <Grid container justify="space-between" alignItems="center"
          title={type === LIST_TYPE_SOCIAL ? SOCIAL_MEDIA_TYPES[item.label] : undefined}>
      <Grid item>{
        type === LIST_TYPE_SOCIAL ?
          <SocialMediaIcon type={item.label} /> :
          item.label
      }
      </Grid>
      <Grid item>URL:{item.url}</Grid>
    </Grid>
  );

  return (
    <div>
      {Object.keys(LIST_TYPES).map(type => (
        <div key={type}>
          <h3>{LIST_TYPES[type].title}</h3>
          <p>{LIST_TYPES[type].description}</p>
          <DraggableList {...{ type, items: itemsByType[type], ItemComponent, handleDragEndAsync, width: '600' }} />
          <Divider />
        </div>
      ))}
    </div>
  )
}

export default LinksPage;
