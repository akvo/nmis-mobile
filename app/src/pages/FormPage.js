import React from 'react';
import { FormContainer } from '../form';
import { BaseLayout } from '../components';
import { FormState } from '../store';

// TODO:: todelete
import * as formDefinition from '../form/example-form.json';

const FormPage = ({ navigation, route }) => {
  const selectedForm = FormState.useState((s) => s.selectedForm);

  const formJSON = React.useMemo(() => {
    if (!selectedForm?.json) {
      return formDefinition;
    }
    return JSON.parse(selectedForm.json.replace(/''/g, "'"));
  }, [selectedForm]);

  const goBack = () => {
    navigation.navigate('ManageForm', { ...route?.params });
  };

  return (
    <BaseLayout title={route?.params?.name} back={goBack}>
      <FormContainer forms={formJSON || formDefinition} initialValues={{}} />
    </BaseLayout>
  );
};

export default FormPage;
