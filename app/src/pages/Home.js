import React from 'react';
import { Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { BaseLayout } from '../components';

const Home = ({ navigation }) => {
  const [search, setSearch] = React.useState(null);
  const goToManageForm = (id) => {
    const findData = data?.find((d) => d?.id === id);
    navigation.navigate('ManageForm', { id, name: findData?.name });
  };

  const goToUsers = () => {
    navigation.navigate('Users');
  };

  const data = Array.from({ length: 100 })
    .map((_, dx) => ({
      id: dx,
      name: `Household ${dx + 1}`,
      subtitles: ['Submitted: 20', 'Draft: 1', 'Synced: 11'],
    }))
    .filter((d) => (search && d?.name?.toLowerCase().includes(search.toLowerCase())) || !search);
  return (
    <BaseLayout
      title="Form Lists"
      search={{
        show: true,
        placeholder: 'Search form',
        value: search,
        action: setSearch,
      }}
      leftComponent={
        <Button type="clear" testID="button-users" onPress={goToUsers}>
          <Icon name="person" size={18} />
        </Button>
      }
    >
      <BaseLayout.Content data={data} action={goToManageForm} columns={2} />
    </BaseLayout>
  );
};

export default Home;
