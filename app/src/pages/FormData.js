import React from 'react';
import { BaseLayout } from '../components';

const FormData = ({ navigation, route }) => {
  const data = Array.from({ length: 100 }).map((_, dx) => ({
    id: dx,
    name: `Datapoint ${dx + 1}`,
    subtitles: ['Created: 23-Jan-2023', 'Survey duration: 1hr 32m'],
  }));
  const goBack = () => {
    navigation.navigate('FormAction', { ...route?.params });
  };
  return (
    <BaseLayout
      title={route?.params?.name}
      search={{
        show: true,
        placeholder: 'Search datapoint',
      }}
      back={goBack}
    >
      <BaseLayout.Content data={data} />
    </BaseLayout>
  );
};

export default FormData;