import React from 'react';
import { Platform } from 'react-native';
import { BaseLayout } from '../components';
import { api } from '../lib';
import { FormState } from '../store';
import { crudForms, crudSessions } from '../database/crud';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

const TASK_NAME = 'sync-form-version';

const syncFormVersion = async (showNotificationOnly = true) => {
  try {
    // find last session
    const session = await crudSessions.selectLastSession();
    if (!session) {
      return;
    }
    const authenticationCode = session.passcode;
    const data = new FormData();
    data.append('code', authenticationCode);
    api
      .post('/auth', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(async (res) => {
        const { data } = res;
        const newFormsVersion = [];
        data.formsUrl.forEach(async (form) => {
          const formExist = await crudForms.selectFormByIdAndVersion({ ...form });
          if (formExist) {
            console.info('[bgTask]Form exist:', form.id, form.version);
            return false;
          }
          if (showNotificationOnly) {
            newFormsVersion.push({ id: form.id, version: form.version });
            return;
          }
          const formRes = await api.get(form.url);
          // update previous form latest value to 0
          const updatedForm = await crudForms.updateForm({ ...form });
          console.info('[bgTask]Updated Forms...', form.id, updatedForm);
          const savedForm = await crudForms.addForm({ ...form, formJSON: formRes?.data });
          console.info('[bgTask]Saved Forms...', form.id, savedForm);
          return form;
        });
        if (newFormsVersion.length && showNotificationOnly) {
          console.info('[bgTask]New form available:', newFormsVersion);
          await sendPushNotification();
          return;
        }
      });
  } catch (err) {
    console.error('[bgTask]sycnFormVersion failed:', err);
  }
};

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    syncFormVersion();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (err) {
    console.error('define task manager failed:', err);
    return BackgroundFetch.Result.Failed;
  }
});

const registerBackgroundTask = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 0.5 * 60, // in minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  } catch (err) {
    console.error('Task Register failed:', err);
  }
};

const unregisterBackgroundTask = async () => {
  try {
    await BackgroundFetch.unregisterTaskAsync(TASK_NAME);
  } catch (err) {
    console.error('Task Unregister failed:', err);
  }
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const sendPushNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'New Form version available',
      body: 'Here is the notification body',
      data: null,
    },
    trigger: null,
  });
};

const registerForPushNotificationsAsync = async () => {
  let token;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.warn('[Notification]Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.warn('[Notification]Must use physical device for Push Notifications');
  }
  return token;
};

const Home = ({ navigation }) => {
  const [search, setSearch] = React.useState(null);
  const [data, setData] = React.useState([]);

  const goToManageForm = (id) => {
    const findData = data.find((d) => d?.id === id);
    FormState.update((s) => {
      s.form = findData;
    });
    setTimeout(() => {
      navigation.navigate('ManageForm', { id: id, name: findData.name });
    }, 100);
  };

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
    if (BackgroundFetch.BackgroundFetchStatus?.[status] === 'Available' && !isRegistered) {
      await registerBackgroundTask();
    }
    console.log('[bgTask]Status', status, isRegistered);
  };

  React.useEffect(() => {
    checkStatusAsync();
  }, []);

  React.useEffect(() => {
    registerForPushNotificationsAsync();
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('[Notification]Received Listener');
    });
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('[Notification]Response Listener');
      syncFormVersion(false);
    });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  React.useState(() => {
    crudForms.selectLatestFormVersion().then((results) => {
      const forms = results.map((r) => ({
        ...r,
        subtitles: ['Submitted: 20', 'Draft: 1', 'Synced: 11'],
      }));
      setData(forms);
    });
  }, []);

  const filteredData = React.useMemo(() => {
    return data.filter(
      (d) => (search && d?.name?.toLowerCase().includes(search.toLowerCase())) || !search,
    );
  }, [data]);

  return (
    <BaseLayout
      title="Form Lists"
      search={{
        show: true,
        placeholder: 'Search form',
        value: search,
        action: setSearch,
      }}
    >
      <BaseLayout.Content data={filteredData} action={goToManageForm} columns={2} />
    </BaseLayout>
  );
};

export default Home;
