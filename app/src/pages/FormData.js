import React, { useState, useEffect, useMemo } from 'react';
import { Button, Dialog, Text } from '@rneui/themed';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { UserState } from '../store';
import { BaseLayout } from '../components';
import { crudDataPoints } from '../database/crud';
import { i18n, backgroundTask } from '../lib';
import { UIState } from '../store';

const convertMinutesToHHMM = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(remainingMinutes).padStart(2, '0');

  return `${formattedHours}h ${formattedMinutes}m`;
};

const syncButtonElement = ({ showSubmitted, handleSyncButtonOnPress, disabled }) => {
  if (!showSubmitted) {
    return {};
  }
  return {
    rightComponent: (
      <Button
        type="clear"
        disabled={disabled}
        onPress={handleSyncButtonOnPress}
        testID="button-to-trigger-sync"
      >
        <Icon name="sync" size={18} />
      </Button>
    ),
  };
};

const FormData = ({ navigation, route }) => {
  const formId = route?.params?.id;
  const showSubmitted = route?.params?.showSubmitted || false;
  const activeLang = UIState.useState((s) => s.lang);
  const trans = i18n.text(activeLang);
  const activeUserId = UserState.useState((s) => s.id);
  const [search, setSearch] = useState(null);
  const [data, setData] = useState([]);
  const [showConfirmationSyncDialog, setShowConfirmationSyncDialog] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const goBack = () => {
    navigation.navigate('ManageForm', { ...route?.params });
  };

  const fetchData = async () => {
    const submitted = showSubmitted ? 1 : 0;
    let results = await crudDataPoints.selectDataPointsByFormAndSubmitted({
      form: formId,
      submitted,
      user: activeUserId,
    });
    results = results.map((res) => {
      const createdAt = new Date(res.createdAt).toLocaleDateString('en-GB');
      const syncedAt = res.syncedAt ? new Date(res.syncedAt).toLocaleDateString('en-GB') : '-';
      let subtitlesTemp = [
        `${trans.createdLabel}${createdAt}`,
        `${trans.surveyDurationLabel}${convertMinutesToHHMM(res.duration)}`,
      ];
      if (showSubmitted) {
        subtitlesTemp = [...subtitlesTemp, `${trans.syncLabel}${syncedAt}`];
      }
      return {
        ...res,
        subtitles: subtitlesTemp,
      };
    });
    setData(results);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(
      (d) => (search && d?.name?.toLowerCase().includes(search.toLowerCase())) || !search,
    );
  }, [data, search]);

  const handleFormDataListAction = (id) => {
    if (showSubmitted) {
      return null;
    }
    return navigation.navigate('FormPage', {
      ...route?.params,
      dataPointId: id,
      newSubmission: false,
    });
  };

  const enableSyncButton = useMemo(() => {
    return data.filter((d) => !d.syncedAt).length > 0;
  }, [data]);

  const handleSyncButtonOnPress = () => {
    setShowConfirmationSyncDialog(true);
  };

  const handleOnSync = async () => {
    setData([]);
    setSyncing(true);
    await backgroundTask.syncFormSubmission();
    await fetchData();
    setSyncing(false);
  };

  return (
    <BaseLayout
      title={route?.params?.name}
      search={{
        show: true,
        placeholder: trans.formDataSearch,
        value: search,
        action: setSearch,
      }}
      leftComponent={
        <Button type="clear" onPress={goBack} testID="arrow-back-button">
          <Icon name="arrow-back" size={18} />
        </Button>
      }
      {...syncButtonElement({
        showSubmitted,
        handleSyncButtonOnPress,
        disabled: !enableSyncButton,
      })}
    >
      {syncing ? (
        <View style={styles.loadingContainer} testID="sync-loading">
          <ActivityIndicator />
        </View>
      ) : (
        <BaseLayout.Content
          data={filteredData}
          action={handleFormDataListAction}
          testID="data-point-list"
        />
      )}

      {/* confirmation dialog to sync */}
      <Dialog visible={showConfirmationSyncDialog} testID="sync-confirmation-dialog">
        <Text testID="sync-confirmation-text">{trans.confirmSync}</Text>
        <Dialog.Actions>
          <Dialog.Button
            title={trans.buttonOk}
            onPress={handleOnSync}
            testID="sync-confirmation-ok"
          />
          <Dialog.Button
            title={trans.buttonCancel}
            onPress={() => setShowConfirmationSyncDialog(false)}
            testID="sync-confirmation-cancel"
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

export default FormData;
