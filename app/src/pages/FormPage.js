import React from 'react';
import { Platform, ToastAndroid, Text, TouchableOpacity } from 'react-native';
import { FormContainer } from '../form';
import { BaseLayout } from '../components';
import { FormState } from '../store';
import { crudDataPoints } from '../database/crud';
import { UserState } from '../store';

const FormPage = ({ navigation, route }) => {
  const selectedForm = FormState.useState((s) => s.form);
  const userId = UserState.useState((s) => s.id);
  const [onSaveFormParams, setOnSaveFormParams] = React.useState({});

  const formJSON = React.useMemo(() => {
    if (!selectedForm?.json) {
      return {};
    }
    return JSON.parse(selectedForm.json.replace(/''/g, "'"));
  }, [selectedForm]);

  const onSaveCallback = React.useCallback((values, refreshForm) => {
    const state = { values, refreshForm };
    setOnSaveFormParams(state);
  }, []);

  const handleOnSaveForm = () => {
    console.log(onSaveFormParams, '===');
  };

  const handleOnSubmitForm = async (values, refreshForm) => {
    try {
      const submitData = {
        form: selectedForm.id,
        user: userId,
        name: values.name,
        submitted: 1,
        duration: 0, // TODO:: set duration
        json: values.answers,
      };
      await crudDataPoints.saveDataPoint(submitData);
      if (Platform.OS === 'android') {
        ToastAndroid.show(`Data point ${values.name} submitted`, ToastAndroid.LONG);
      }
      refreshForm();
      navigation.navigate('FormData', { ...route?.params, showSubmitted: true });
    } catch (err) {
      console.error(err);
      if (Platform.OS === 'android') {
        ToastAndroid.show(`Error! Can't submit data point ${values.name}`, ToastAndroid.LONG);
      }
    }
  };

  return (
    <BaseLayout title={route?.params?.name}>
      <FormContainer
        forms={formJSON}
        initialValues={{}}
        onSubmit={handleOnSubmitForm}
        onSave={onSaveCallback}
      />
    </BaseLayout>
  );
};

export default FormPage;
