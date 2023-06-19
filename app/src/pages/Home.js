import React from 'react';
import { Text, Header, Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { DividerLayout, Stack } from '../components';

const Home = ({ navigation }) => {
  const [search, setSearch] = React.useState(null);
  return (
    <Stack>
      <Header
        backgroundColor="#f3f4f6"
        statusBarProps={{
          backgroundColor: '#171717',
        }}
        containerStyle={{
          height: 81,
        }}
      >
        <Text>Hello</Text>
        {''}
        <Button type="clear">
          <Icon name="ellipsis-vertical" />
        </Button>
      </Header>
      <DividerLayout
        search={{
          callback: setSearch,
          value: search,
          placeholder: 'Find Form...',
        }}
        list={{
          title: 'Sync recent form',
          data: [
            {
              amount: 1,
              description: 'Household Form 1',
            },
            {
              amount: 2,
              description: 'Household Form 1',
            },
            {
              amount: 3,
              description: 'Household Form 1',
            },
            {
              amount: 4,
              description: 'Household Form 1',
            },
            {
              amount: 5,
              description: 'Household Form 1',
            },
          ],
        }}
      >
        <Text>Home</Text>
        <Text>{search}</Text>
      </DividerLayout>
    </Stack>
  );
};

export default Home;
