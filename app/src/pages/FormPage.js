import React from 'react';
import { FormContainer } from '../form';
import { BaseLayout } from '../components';
// TODO:: todelete
import * as formDefinition from '../form/example-form.json';

const FormPage = ({ navigation, route }) => {
  const goBack = () => {
    navigation.navigate('FormAction', { ...route?.params });
  };

  return (
    <BaseLayout title={route?.params?.name} back={goBack}>
      <FormContainer forms={formDefinition} initialValues={{}} />
    </BaseLayout>
  );
};

export default FormPage;
