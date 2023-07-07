import React from 'react';
import { Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { BaseLayout } from '../components';
import { FormState } from '../store';
import { crudForms } from '../database/crud';

const Home = ({ navigation }) => {
  const [search, setSearch] = React.useState(null);
  const [data, setData] = React.useState([]);

  const goToManageForm = (id) => {
    const findData = data.find((d) => d?.id === id);
    FormState.update((s) => {
      s.form = findData;
    });
    setTimeout(() => {
      navigation.navigate('ManageForm', { id: id, name: findData.name });
    }, 100);
  };

  const goToUsers = () => {
    navigation.navigate('Users');
  };

  React.useState(() => {
    crudForms.selectLatestFormVersion().then((results) => {
      const forms = results.map((r) => ({
        ...r,
        subtitles: [`Version: ${r.version}`, 'Submitted: 20', 'Draft: 1', 'Synced: 11'],
      }));
      setData(forms);
    });
  }, []);

  const filteredData = React.useMemo(() => {
    return data.filter(
      (d) => (search && d?.name?.toLowerCase().includes(search.toLowerCase())) || !search,
    );
  }, [data]);

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
      <BaseLayout.Content data={filteredData} action={goToManageForm} columns={2} />
    </BaseLayout>
  );
};

export default Home;
