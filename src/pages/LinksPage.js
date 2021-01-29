import React, { useState } from 'react';
import { Button, Divider, Grid, LinearProgress } from '@material-ui/core';

import {
  LIST_TYPES,
  LIST_TYPE_SOCIAL,
  LIST_TYPE_FOOTER,
  LIST_TYPE_NOTIFICATION,
  LIST_TYPE_LEGAL,
  SOCIAL_MEDIA_TYPES,
} from '../constants';
import { deleteMenuItemAsync, fetchMenuListAsync, fetchMenuListOfTypeAsync, saveMenuItemAsync, saveMenuOrderAsync } from '../api';
import DraggableList from '../components/elements/DraggableList';
import SocialMediaIcon from '../components/elements/SocialMediaIcon';
import MenuItemDialog from '../components/MenuItemDialog';

const DEFAULT_ITEMS_BY_TYPE = {
    // by default show all possible items, even when they are not saved
  [LIST_TYPE_SOCIAL]: Object.keys(SOCIAL_MEDIA_TYPES)
    .map((label, priority) => ({ label, url: '', priority })),
  [LIST_TYPE_FOOTER]: [],
  [LIST_TYPE_NOTIFICATION]: [],
  [LIST_TYPE_LEGAL]: [],
};

// NB! DraggableList memoizes its items and does not re-render by default when some of it items changes.
// So we have to provide additional property 'renderKey' and when this changes, then also DraggableList re-renders.
const DEFAULT_RENDER_KEYS_BY_TYPE = Object.keys(LIST_TYPES).reduce((acc, type) => ({ [type]: type }), {});

const LinksPage = ({
  channel,
}) => {
  const [itemsByType, setItemsByType] = useState(DEFAULT_ITEMS_BY_TYPE);
  const [renderKeysByType, setRenderKeysByType] = useState(DEFAULT_RENDER_KEYS_BY_TYPE);
  const [activeItem, setActiveItem] = useState({ channel });
  const [showDialog, setShowDialog] = useState(false);
  const [pageIsLoading, setPageIsLoading] = useState(true);
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
    return <LinearProgress />
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
      const typeItems = result.data.data || [];
      setItemsByType(prevState => ({ ...prevState, [type]: typeItems }));
      setRenderKeysByType(prevState => ({ ...prevState, [type]: `${type}-${(new Date()).toTimeString()}` }));
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
      {type === LIST_TYPE_SOCIAL ? <SocialMediaIcon type={item.label} color={item.url ? 'inherit' : 'disabled'} /> : item.label}
    </div>
  );

  return (
    <div>
      {Object.keys(LIST_TYPES).map(type => (
        <div key={type}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item style={{ paddingLeft: 8 }}>
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
          <DraggableList {...{ type, items: itemsByType[type], ItemComponent, renderKey: renderKeysByType[type],
            handleDragEndAsync, width: '600', isVertical: LIST_TYPES[type].direction !== 'horizontal' }} />
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
