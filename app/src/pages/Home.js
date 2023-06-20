import React from 'react';
import { BaseLayout } from '../components';

const Home = ({ navigation }) => {
  const goToFormAction = (id) => {
    const findData = data?.find((d) => d?.id === id);
    navigation.navigate('FormAction', { id, name: findData?.name });
  };

  const data = Array.from({ length: 100 }).map((_, dx) => ({
    id: dx,
    name: `Household ${dx + 1}`,
    subtitles: ['Submitted: 20', 'Draft: 1', 'Synced: 11'],
  }));
  return (
    <BaseLayout
      title="Form Lists"
      search={{
        show: true,
        placeholder: 'Search form',
      }}
    >
      <BaseLayout.Content data={data} action={goToFormAction} columns={2} />
    </BaseLayout>
  );
};

export default Home;
