import React from 'react';
import { BaseLayout } from '../components';
import { api } from '../lib';
import { AuthState, UIState } from '../store';
import { crudForms } from '../database/crud';

const Home = ({ navigation }) => {
  const isOnline = UIState.useState((s) => s.online);
  const authenticationCode = AuthState.useState((s) => s.authenticationCode);
  const [search, setSearch] = React.useState(null);

  const goToManageForm = (id) => {
    const findData = data?.find((d) => d?.id === id);
    navigation.navigate('ManageForm', { id, name: findData?.name });
  };

  React.useEffect(() => {
    // check forms new form version available
    if (!isOnline || !authenticationCode || authenticationCode === '') {
      return;
    }
    const data = new FormData();
    data.append('code', authenticationCode);
    api
      .post('/auth', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(async (res) => {
        const { data } = res;
        data.formsUrl.forEach(async (form) => {
          const formExist = await crudForms.selectFormByIdAndVersion({ ...form });
          if (formExist) {
            // skip
            return;
          }
          const formRes = await api.get(form.url);
          // update previous form latest value to 0
          const updatedForm = await crudForms.updateForm({ ...form });
          console.info('Updated Forms...', form.id, updatedForm);
          const savedForm = await crudForms.addForm({ ...form, formJSON: formRes?.data });
          console.info('Saved Forms...', form.id, savedForm);
        });
      });
  }, []);

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
    >
      <BaseLayout.Content data={data} action={goToManageForm} columns={2} />
    </BaseLayout>
  );
};

export default Home;
