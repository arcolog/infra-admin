import React, { useState } from 'react';
import { Button, Divider, Grid, LinearProgress, TextField} from '@material-ui/core';

import {
  LIST_TYPES,
  LIST_TYPE_SOCIAL,
  LIST_TYPE_FOOTER,
  LIST_TYPE_NOTIFICATION,
  LIST_TYPE_LEGAL,
  SOCIAL_MEDIA_TYPES,
} from '../constants';
import { deleteMenuItemAsync, fetchMenuListAsync, fetchMenuListOfTypeAsync, postMenuItemAsync,
  postMenuOrderAsync, fetchSiteAsync, postSiteAsync } from '../api';
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

// NB! DraggableList memorizes its items and does not re-render by default when some of it items changes.
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
  const [siteData, setSiteData] = useState({});

  const composeSocialMediaLinks = items => {
    // add missing social media items to list
    const type = LIST_TYPE_SOCIAL;
    const updatedItems = [...items];
    const existingSocialTypes = updatedItems.map(item => item.label);
    for (const socialType of Object.keys(SOCIAL_MEDIA_TYPES)) {
      if (existingSocialTypes.indexOf(socialType) < 0) {
        updatedItems.push({
          channel, type, label: socialType, url: '', priority: updatedItems.length
        });
      }
    }
    return updatedItems;
  }

  React.useEffect(async () => {
    setPageIsLoading(true);
    const updatedItemsByType = (await fetchMenuListAsync({ channel })).data.data;
    updatedItemsByType[LIST_TYPE_SOCIAL] = composeSocialMediaLinks(updatedItemsByType[LIST_TYPE_SOCIAL]);
    setItemsByType(updatedItemsByType);

    const result = await fetchSiteAsync({ channel });
    setSiteData(result.data.data);

    setPageIsLoading(false);
  }, []);

  if (pageIsLoading) {
    return <LinearProgress />
  }

  const handleDragEndAsync = async ({ type, items }) => {
    setItemsByType(prevState => ({ ...prevState, [type]: items }));
    await postMenuOrderAsync({ channel, data: items });
  }

  const fetchListAsync = async ({ type }) => {
    setIsLoading(true);
    const result = await fetchMenuListOfTypeAsync({ channel, type });
    setIsLoading(false);
    if (result.status === 200) {
      let typeItems = result.data.data || [];
      if (type === LIST_TYPE_SOCIAL) {
        typeItems = composeSocialMediaLinks(typeItems);
      }
      setItemsByType(prevState => ({ ...prevState, [type]: typeItems }));
      setRenderKeysByType(prevState => ({ ...prevState, [type]: `${type}-${(new Date()).toTimeString()}` }));
    }
  };

  const saveMenuItemAsync = async () => {
    setError('');
    try {
      setIsLoading(true);
      const { type } = activeItem;
      const result = await postMenuItemAsync(activeItem);
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

  const handleSiteProp = (label, value) => {
    setSiteData(prevState => ({ ...prevState, [label]: value }));
  }

  const saveSiteItemAsync = async () => {
    setIsLoading(true);
    await postSiteAsync(siteData);
    setIsLoading(false);
  }

  const renderSiteItemInput = (label, type) => (
    <TextField label={label} defaultValue={siteData[type]} style={{ margin: '10px 50px 10px 0', minWidth: 250 }}
               onChange={e => handleSiteProp(type, e.target.value)} />
  );

  return (
    <div>
      <div style={{ background: '#fafafa', padding: 10, border: '1px solid #eee' }}>
        <Grid container wrap="nowrap" justify="flex-start">
          <Grid>{renderSiteItemInput('Nimetus', 'label')}</Grid>
          <Grid item>
            <Button onClick={() => saveSiteItemAsync()} size="small" variant="outlined" color="primary">Salvesta</Button>
          </Grid>
        </Grid>
        <Grid container wrap="nowrap" justify="flex-start">
          <Grid>{renderSiteItemInput('Aadress', 'address')}</Grid>
          <Grid>{renderSiteItemInput('Email', 'email')}</Grid>
        </Grid>
        <Grid container wrap="nowrap" justify="flex-start">
          <Grid>{renderSiteItemInput('Copyright', 'copyright')}</Grid>
          <Grid>{renderSiteItemInput('Telefon', 'phone')}</Grid>
        </Grid>
      </div>
      <br />
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
        handleSubmitAsync={saveMenuItemAsync}
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
