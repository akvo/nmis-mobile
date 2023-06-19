import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text, SearchBar, Card } from '@rneui/themed';
import Stack from './Stack';
import Carousel from './Carousel';

const DividerLayout = ({
  children,
  search = {
    callback: null,
    value: null,
    placeholder: '',
  },
  list = {
    title: null,
    data: [],
  },
}) => {
  return (
    <Stack>
      <Stack>
        {search?.callback && (
          <SearchBar
            placeholder={search?.placeholder}
            onChangeText={search.callback}
            value={search.value}
          />
        )}
        {list?.title && <Text style={{ padding: 8, marginTop: 4 }}>{list.title}</Text>}
        <Carousel control>
          {list?.data?.map((d, dx) => {
            return <Carousel.Summary key={dx} {...d} />;
          })}
        </Carousel>
      </Stack>
      <Stack background="#d1d5db">{children}</Stack>
    </Stack>
  );
};

export default DividerLayout;
