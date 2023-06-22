import React from 'react';
import { BaseLayout } from '../components';

const Form = ({ navigation, route }) => {
  const goBack = () => {
    navigation.navigate('FormAction', { ...route?.params });
  };
  return (
    <BaseLayout title={route?.params?.name} back={goBack}>
      <BaseLayout.Content data={[]} />
    </BaseLayout>
  );
};

export default Form;
