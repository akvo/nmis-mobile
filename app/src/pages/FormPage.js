import React from 'react';
import { Platform, ToastAndroid } from 'react-native';
import { FormContainer } from '../form';
import { BaseLayout } from '../components';
import { FormState } from '../store';
import { crudDataPoints } from '../database/crud';
import { UserState } from '../store';
import { generateDataPointName } from '../form/lib';

const FormPage = ({ navigation, route }) => {
  const { form: selectedForm, dataPointName } = FormState.useState((s) => s);
  const userId = UserState.useState((s) => s.id);

  const formJSON = React.useMemo(() => {
    if (!selectedForm?.json) {
      return {};
    }
    return JSON.parse(selectedForm.json.replace(/''/g, "'"));
  }, [selectedForm]);

  const { dpName: subTitleText } = generateDataPointName(dataPointName);

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
      setTimeout(() => {
        refreshForm();
        navigation.navigate('FormData', { ...route?.params, showSubmitted: true });
      }, 100);
    } catch (err) {
      console.error(err);
      if (Platform.OS === 'android') {
        ToastAndroid.show(`Error! Can't submit data point ${values.name}`, ToastAndroid.LONG);
      }
    }
  };

  return (
    <BaseLayout title={route?.params?.name} subTitle={subTitleText}>
      <FormContainer forms={formJSON} initialValues={{}} onSubmit={handleOnSubmitForm} />
    </BaseLayout>
  );
};

export default FormPage;
