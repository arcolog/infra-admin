import React, { useState } from 'react';

import { LIST_TYPE_SOCIAL, SOCIAL_MEDIA_TYPES } from '../constants';
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

  return (
    <div>
      <DraggableList items={socialItems} {...SOCIAL_MEDIA_TYPES[LIST_TYPE_SOCIAL]} />
    </div>
  )
}

export default LinksPage;
