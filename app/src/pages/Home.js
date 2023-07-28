import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { BaseLayout } from '../components';
import { FormState, UserState, UIState } from '../store';
import { crudForms } from '../database/crud';
import { i18n } from '../lib';

const Home = ({ navigation }) => {
  const [search, setSearch] = useState(null);
  const [data, setData] = useState([]);
  const activeLang = UIState.useState((s) => s.lang);
  const trans = i18n.text(activeLang);

  const currentUserName = UserState.useState((s) => s.name);
  const subTitleText = currentUserName ? `${trans.userLabel} ${currentUserName}` : null;

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

  useEffect(() => {
    crudForms.selectLatestFormVersion().then((results) => {
      const forms = results.map((r) => ({
        ...r,
        subtitles: [
          `${trans.versionLabel}${r.version}`,
          `${trans.submittedLabel} 20`,
          `${trans.draftLabel}1`,
          `${trans.syncLabel}11`,
        ],
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
      title={trans.homePageTitle}
      subTitle={subTitleText}
      search={{
        show: true,
        placeholder: trans.homeSearch,
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
