import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { BaseLayout } from '../components';
import { FormState, UserState, UIState } from '../store';
import { crudForms } from '../database/crud';
import { i18n } from '../lib';

const Home = ({ navigation, route }) => {
  const params = route?.params || null;
  const { id: currentUserId, name: currentUserName } = UserState.useState((s) => s);
  const [search, setSearch] = useState(null);
  const [appLang, setAppLang] = useState('en');
  const allForms = FormState.useState((s) => s.allForms);
  const activeLang = UIState.useState((s) => s.lang);

  const trans = i18n.text(activeLang);
  const subTitleText = currentUserName ? `${trans.userLabel} ${currentUserName}` : null;

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

  useEffect(() => {
    if (params || currentUserId || activeLang !== appLang) {
      setAppLang(activeLang);
      FormState.update((s) => {
        s.form = {};
      });
      crudForms.selectLatestFormVersion({ user: currentUserId }).then((results) => {
        const forms = results.map((r) => ({
          ...r,
          subtitles: [
            `${trans.versionLabel}${r.version}`,
            `${trans.submittedLabel}${r.submitted}`,
            `${trans.draftLabel}${r.draft}`,
            `${trans.syncLabel}${r.synced}`,
          ],
        }));
        FormState.update((s) => {
          s.allForms = forms;
        });
      });
    }
  }, [currentUserId, params, appLang, activeLang]);

  const filteredForms = useMemo(() => {
    return allForms.filter(
      (d) => (search && d?.name?.toLowerCase().includes(search.toLowerCase())) || !search,
    );
  }, [allForms, search]);

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
      <BaseLayout.Content data={filteredForms} action={goToManageForm} columns={2} />
    </BaseLayout>
  );
};

export default Home;
