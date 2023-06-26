import React from 'react';
import { Webform } from '../form';
import { BaseLayout } from '../components';
import * as formDefinition from '../form/example-form.json';

const WebformPage = ({ navigation, route }) => {
  const goBack = () => {
    navigation.navigate('FormAction', { ...route?.params });
  };

  return (
    <BaseLayout title={route?.params?.name} back={goBack}>
      <Webform forms={formDefinition} initialValues={{}} />
    </BaseLayout>
  );
};

export default WebformPage;
