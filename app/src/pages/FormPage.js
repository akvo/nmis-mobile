import React from 'react';
import {
  Platform,
  ToastAndroid,
  BackHandler,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { Button, Dialog, Text } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { FormContainer } from '../form';
import { SaveDialogMenu, SaveDropdownMenu } from '../form/support';
import { BaseLayout } from '../components';
import { FormState } from '../store';
import { crudDataPoints, crudForms } from '../database/crud';
import { UserState } from '../store';
import { generateDataPointName } from '../form/lib';

const FormPage = ({ navigation, route }) => {
  const { form: selectedForm, dataPointName } = FormState.useState((s) => s);
  const userId = UserState.useState((s) => s.id);
  const [onSaveFormParams, setOnSaveFormParams] = React.useState({});
  const [showDialogMenu, setShowDialogMenu] = React.useState(false);
  const [showDropdownMenu, setShowDropdownMenu] = React.useState(false);
  const [showExitConfirmationDialog, setShowExitConfirmationDialog] = React.useState(false);

  const currentFormId = route?.params?.id;
  // continue saved submission
  const savedDataPointId = route?.params?.dataPointId;
  const isNewSubmission = route?.params?.newSubmission;
  const [initialValues, setInitialValues] = React.useState({});
  const [currentDataPoint, setCurrentDataPoint] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  console.log(currentDataPoint);

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      const values = onSaveFormParams?.values;
      if (values && Object.keys(values).length) {
        setShowDialogMenu(true);
        return true;
      }
      if (onSaveFormParams?.refreshForm) {
        onSaveFormParams.refreshForm();
      }
      return false;
    });
    return () => backHandler.remove();
  }, [onSaveFormParams]);

  React.useEffect(() => {
    if (!isNewSubmission) {
      fetchSavedSubmission().catch((e) => console.error('[Fetch Data Point Failed]: ', e));
    }
  }, [isNewSubmission]);

  const fetchSavedSubmission = React.useCallback(async () => {
    setLoading(true);
    const dpValue = await crudDataPoints.selectDataPointById({ id: savedDataPointId });
    setCurrentDataPoint(dpValue);
    if (dpValue?.json?.length) {
      setInitialValues(dpValue.json[0]);
    }
    setLoading(false);
  }, [savedDataPointId]);

  const formJSON = React.useMemo(() => {
    if (!selectedForm?.json) {
      return {};
    }
    return JSON.parse(selectedForm.json);
  }, [selectedForm]);

  const { dpName: subTitleText } = generateDataPointName(dataPointName);

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
    if (onSaveFormParams?.refreshForm) {
      onSaveFormParams.refreshForm();
    }
    return navigation.goBack();
  };

  const handleOnSaveAndExit = async () => {
    const { values, refreshForm } = onSaveFormParams;
    try {
      const saveData = {
        form: currentFormId,
        user: userId,
        name: values?.name || 'Untitled',
        geo: values?.geo || null,
        submitted: 0,
        duration: 0, // TODO:: set duration
        json: values?.answers || [],
      };
      const dbCall = isNewSubmission
        ? crudDataPoints.saveDataPoint
        : crudDataPoints.updateDataPoint;
      await dbCall({ ...currentDataPoint, ...saveData });
      if (Platform.OS === 'android') {
        ToastAndroid.show(`Data point ${values?.name} saved`, ToastAndroid.LONG);
      }
      if (refreshForm) {
        refreshForm();
      }
      navigation.navigate('ManageForm', { ...route?.params });
    } catch (err) {
      console.error(err);
      if (Platform.OS === 'android') {
        ToastAndroid.show(`Error! Can't save data point ${values?.name}`, ToastAndroid.LONG);
      }
    }
  };

  const handleShowExitConfirmationDialog = () => {
    setShowDropdownMenu(false);
    setShowDialogMenu(false);
    setShowExitConfirmationDialog(true);
  };

  const handleOnExit = () => {
    if (onSaveFormParams?.refreshForm) {
      onSaveFormParams.refreshForm();
    }
    return navigation.navigate('Home');
  };

  const handleOnSubmitForm = async (values, refreshForm) => {
    try {
      const submitData = {
        form: currentFormId,
        user: userId,
        name: values.name,
        geo: values.geo,
        submitted: 1,
        duration: 0, // TODO:: set duration
        json: values.answers,
      };
      const dbCall = isNewSubmission
        ? crudDataPoints.saveDataPoint
        : crudDataPoints.updateDataPoint;
      await dbCall({ ...currentDataPoint, ...submitData });
      if (Platform.OS === 'android') {
        ToastAndroid.show(`Data point ${values.name} submitted`, ToastAndroid.LONG);
      }
      refreshForm();
      navigation.navigate('ManageForm', { ...route?.params });
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
      subTitle={subTitleText}
      leftComponent={
        <Button type="clear" onPress={handleOnPressArrowBackButton} testID="arrow-back-button">
          <Icon name="arrow-back" size={18} />
        </Button>
      }
      rightComponent={
        <SaveDropdownMenu
          visible={showDropdownMenu}
          setVisible={setShowDropdownMenu}
          anchor={
            <Button
              type="clear"
              testID="form-page-kebab-menu"
              onPress={() => setShowDropdownMenu(true)}
            >
              <Icon name="ellipsis-vertical" size={18} />
            </Button>
          }
          handleOnExit={handleShowExitConfirmationDialog}
          handleOnSaveAndExit={handleOnSaveAndExit}
        />
      }
    >
      {!loading ? (
        <FormContainer
          forms={formJSON}
          initialValues={initialValues}
          onSubmit={handleOnSubmitForm}
          onSave={onSaveCallback}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      )}
      <SaveDialogMenu
        visible={showDialogMenu}
        setVisible={setShowDialogMenu}
        handleOnExit={handleShowExitConfirmationDialog}
        handleOnSaveAndExit={handleOnSaveAndExit}
      />
      <Dialog visible={showExitConfirmationDialog} testID="exit-confirmation-dialog">
        <Text testID="exit-confirmation-text">Are you sure want to exit form submission?</Text>
        <Dialog.Actions>
          <Dialog.Button title="Exit" onPress={handleOnExit} testID="exit-confirmation-ok" />
          <Dialog.Button
            title="Cancel"
            onPress={() => setShowExitConfirmationDialog(false)}
            testID="exit-confirmation-cancel"
          />
        </Dialog.Actions>
      </Dialog>
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export default FormPage;
