import React from 'react';
import { FormContainer } from '../form';
import { BaseLayout } from '../components';
import { FormState } from '../store';

// TODO:: todelete
import * as formDefinition from '../form/example-form.json';

const FormPage = ({ navigation, route }) => {
  const selectedForm = FormState.useState((s) => s.form);

  const formJSON = React.useMemo(() => {
    if (!selectedForm?.json) {
      return formDefinition;
    }
    return JSON.parse(selectedForm.json.replace(/''/g, "'"));
  }, [selectedForm]);

  const goBack = () => {
    navigation.navigate('ManageForm', { ...route?.params });
  };

  const handleOnSubmitForm = (values, refreshForm) => {
    console.log(values, refreshForm);
  };

  return (
    <BaseLayout title={route?.params?.name} back={goBack}>
      <FormContainer
        forms={formJSON || formDefinition}
        initialValues={{}}
        onSubmit={handleOnSubmitForm}
      />
    </BaseLayout>
  );
};

export default FormPage;
