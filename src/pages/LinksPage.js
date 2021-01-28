import React, { useState } from 'react';
import { Button, Divider, Grid } from '@material-ui/core';

import {
  LIST_TYPES,
  LIST_TYPE_SOCIAL,
  LIST_TYPE_FOOTER,
  LIST_TYPE_NOTIFICATION,
  SOCIAL_MEDIA_TYPES,
} from '../constants';
import { deleteMenuItemAsync, fetchMenuListAsync, fetchMenuListOfTypeAsync, saveMenuItemAsync, saveMenuOrderAsync } from '../api';
import DraggableList from '../components/elements/DraggableList';
import LoadingBackdrop from '../components/elements/LoadingBackdrop';
import SocialMediaIcon from '../components/elements/SocialMediaIcon';
import MenuItemDialog from '../components/MenuItemDialog';

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
  const [activeItem, setActiveItem] = useState({ channel });
  const [showDialog, setShowDialog] = useState(false);
  const [pageIsLoading, setPageIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  React.useEffect(async () => {
    setPageIsLoading(true);
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
    setPageIsLoading(false);
  }, []);

  if (pageIsLoading) {
    return <LoadingBackdrop />
  }

  const handleDragEndAsync = async (type, items) => {
    setItemsByType(prevState => ({ ...prevState, [type]: items }));
    await saveMenuOrderAsync({ channel, data: items });
  }

  const fetchListAsync = async ({ type }) => {
    setIsLoading(true);
    const result = await fetchMenuListOfTypeAsync({ channel, type });
    setIsLoading(false);
    if (result.status === 200) {
      setItemsByType(prevState => ({ ...prevState, [type]: result.data.data || [] }));
    }
  };

  const saveItemAsync = async () => {
    setError('');
    try {
      setIsLoading(true);
      const { type } = activeItem;
      const result = await saveMenuItemAsync(activeItem);
      setIsLoading(false);
      if (result.status < 400) {
        await fetchListAsync({ type });
        setShowDialog(false);
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }

  const deleteItemAsync = async () => {
    setError('');
    try {
      setIsLoading(true);
      const { type } = activeItem;
      const result = await deleteMenuItemAsync(activeItem);
      setIsLoading(false);
      if (result.status < 400) {
        await fetchListAsync({ type });
        setShowDialog(false);
        setActiveItem({ channel });
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }

  const openDialog = (item) => {
    setActiveItem(item);
    setShowDialog(true);
  }

  const ItemComponent = ({ item, type }) => (
    <div style={{ cursor: 'pointer' }} onClick={() => openDialog(item)}
         title={type === LIST_TYPE_SOCIAL ? SOCIAL_MEDIA_TYPES[item.label] : undefined}>
      {type === LIST_TYPE_SOCIAL ? <SocialMediaIcon type={item.label} /> : item.label}
    </div>
  );

  return (
    <div>
      {Object.keys(LIST_TYPES).map(type => (
        <div key={type}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <h3 style={{ marginBottom: 0 }}>{LIST_TYPES[type].title}</h3>
              <p style={{ margin: 0 }}>{LIST_TYPES[type].description}</p>
            </Grid>
            <Grid item>
              {type !== LIST_TYPE_SOCIAL && (
                <Button	onClick={() => openDialog({ channel, type, priority: itemsByType[type].length })}
                         size="small" variant="outlined" color="primary">Lisa uus</Button>
              )}
            </Grid>
          </Grid>
          <DraggableList {...{ type, items: itemsByType[type], ItemComponent,
            handleDragEndAsync, width: '600', isVertical: type !== LIST_TYPE_SOCIAL }} />
          <Divider />
        </div>
      ))}
      <MenuItemDialog
        item={activeItem}
        error={error}
        handleSubmitAsync={saveItemAsync}
        handleDeleteAsync={deleteItemAsync}
        handleClose={() => {setActiveItem({ channel });setShowDialog(false);}}
        handleChange={(field, value) => setActiveItem(prevState => ({ ...prevState, [field]: value }))}
        isOpened={showDialog}
        isLoading={isLoading}
      />
    </div>
  )
}

export default LinksPage;
