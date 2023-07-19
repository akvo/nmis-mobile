import React from 'react';
import { Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { BaseLayout } from '../components';
import { FormState } from '../store';
import { crudForms } from '../database/crud';

const Home = ({ navigation }) => {
  const [search, setSearch] = React.useState(null);
  const allForms = FormState.useState((s) => s.allForms);

  const goToManageForm = (id) => {
    const findForm = allForms.find((d) => d?.id === id);
    FormState.update((s) => {
      s.form = findForm;
    });
    setTimeout(() => {
      navigation.navigate('ManageForm', { id: id, name: findForm.name });
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
      FormState.update((s) => {
        s.allForms = forms;
      });
    });
  }, []);

  const filteredForms = React.useMemo(() => {
    return allForms.filter(
      (d) => (search && d?.name?.toLowerCase().includes(search.toLowerCase())) || !search,
    );
  }, [allForms]);

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
      <BaseLayout.Content data={filteredForms} action={goToManageForm} columns={2} />
    </BaseLayout>
  );
};

export default Home;
