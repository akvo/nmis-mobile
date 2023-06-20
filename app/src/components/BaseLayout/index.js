import React from 'react';
import { SearchBar } from '@rneui/themed';
import Stack from '../Stack';
import PageTitle from './PageTitle';
import { Content } from './Content';

const BaseLayout = ({
  children,
  title = null,
  back = null,
  search = {
    placeholder: null,
    show: false,
  },
}) => {
  return (
    <Stack>
      {title && <PageTitle text={title} back={back} />}
      {search.show && <SearchBar placeholder={search?.placeholder} testID="search-bar" />}
      {children}
    </Stack>
  );
};

BaseLayout.Content = Content;

export default BaseLayout;
