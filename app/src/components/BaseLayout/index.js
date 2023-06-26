import React from 'react';
import { SearchBar } from '@rneui/themed';
import Stack from '../Stack';
import PageTitle from './PageTitle';
import { Content } from './Content';

const BaseLayout = ({
  children,
  title = null,
  search = {
    placeholder: null,
    show: false,
    value: null,
    action: null,
  },
}) => {
  let searchProps = {
    placeholder: search?.placeholder,
    value: search?.value,
  };
  if (search?.action && typeof search.action === 'function') {
    searchProps = { ...searchProps, onChangeText: search.action };
  }
  return (
    <Stack>
      {title && <PageTitle text={title} />}
      {search.show && <SearchBar {...searchProps} testID="search-bar" />}
      {children}
    </Stack>
  );
};

BaseLayout.Content = Content;

export default BaseLayout;
