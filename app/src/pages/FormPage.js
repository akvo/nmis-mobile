import React from 'react';
import { Platform, ToastAndroid, StyleSheet } from 'react-native';
import { Button, Dialog } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { FormContainer } from '../form';
import { BaseLayout } from '../components';
import { FormState } from '../store';
import { crudDataPoints } from '../database/crud';
import { UserState } from '../store';

const FormPage = ({ navigation, route }) => {
  const selectedForm = FormState.useState((s) => s.form);
  const userId = UserState.useState((s) => s.id);
  const [onSaveFormParams, setOnSaveFormParams] = React.useState({});
  const [showDialogMenu, setShowDialogMenu] = React.useState(false);

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

  const handleOnPressArrowBackButton = () => {
    const values = onSaveFormParams?.values;
    if (values && Object.keys(values).length) {
      setShowDialogMenu(true);
      return;
    }
    return navigation?.canGoBack() ? navigation.goBack() : false;
  };

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
    <BaseLayout
      title={route?.params?.name}
      leftComponent={
        <Button type="clear" onPress={handleOnPressArrowBackButton} testID="arrow-back-button">
          <Icon name="arrow-back" size={18} />
        </Button>
      }
      rightComponent={
        <Button type="clear" testID="form-page-kebab-menu" onPress={() => setShowDialogMenu(true)}>
          <Icon name="ellipsis-vertical" size={18} />
        </Button>
      }
    >
      <FormContainer
        forms={formJSON}
        initialValues={{}}
        onSubmit={handleOnSubmitForm}
        onSave={onSaveCallback}
      />
      <Dialog
        visible={showDialogMenu}
        testID="form-page-dialog-menu"
        overlayStyle={styles.dialogMenuContainer}
        onBackdropPress={() => setShowDialogMenu(false)}
      >
        <Dialog.Button type="outline" title="Save and Exit" testID="save-and-exit-button" />
        <Dialog.Button
          type="outline"
          title="Exit without Saving"
          testID="exit-without-saving-button"
          buttonStyle={styles.buttonDanger}
          titleStyle={styles.textDanger}
        />
      </Dialog>
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
  dialogMenuContainer: { flex: 0.13, flexDirection: 'column', justifyContent: 'space-between' },
  buttonDanger: {
    borderColor: '#D63D39',
  },
  textDanger: {
    color: '#D63D39',
  },
});

export default FormPage;
