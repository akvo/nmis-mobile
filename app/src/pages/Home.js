import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { BaseLayout } from '../components';
import { FormState, UserState } from '../store';
import { crudForms } from '../database/crud';

const Home = ({ navigation }) => {
  const [search, setSearch] = useState(null);
  const [data, setData] = useState([]);
  const currentUserName = UserState.useState((s) => s.name);
  const subTitleText = currentUserName ? `User: ${currentUserName}` : null;

  const goToManageForm = (id) => {
    const findForm = data.find((d) => d?.id === id);
    FormState.update((s) => {
      s.form = findForm;
    });
    navigation.navigate('ManageForm', { id: id, name: findForm.name });
  };

  const goToUsers = () => {
    navigation.navigate('Users');
  };

  useEffect(() => {
    FormState.update((s) => {
      s.form = {};
    });
    crudForms.selectLatestFormVersion().then((results) => {
      const forms = results.map((r) => ({
        ...r,
        subtitles: [`Version: ${r.version}`, 'Submitted: 20', 'Draft: 1', 'Synced: 11'],
      }));
      setData(forms);
    });
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(
      (d) => (search && d?.name?.toLowerCase().includes(search.toLowerCase())) || !search,
    );
  }, [data, search]);

  return (
    <BaseLayout
      title="Form Lists"
      subTitle={subTitleText}
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
