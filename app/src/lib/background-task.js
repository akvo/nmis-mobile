import { crudForms, crudSessions } from '../database/crud';
import api from './api';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const syncFormVersion = async ({
  showNotificationOnly = true,
  sendPushNotification = () => {},
}) => {
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
        console.log('[bgTask]Fetch Auth Success');
        const { data } = res;
        const promises = data.formsUrl.map(async (form) => {
          const formExist = await crudForms.selectFormByIdAndVersion({ ...form });
          if (formExist) {
            return false;
          }
          if (showNotificationOnly) {
            console.info('[bgTask]New form:', form.id, form.version);
            return { id: form.id, version: form.version };
          }
          const formRes = await api.get(form.url);
          // update previous form latest value to 0
          await crudForms.updateForm({ ...form });
          console.info('[syncForm]Updated Forms...', form.id);
          const savedForm = await crudForms.addForm({ ...form, formJSON: formRes?.data });
          console.info('[syncForm]Saved Forms...', form.id);
          return savedForm;
        });
        Promise.all(promises).then(async (res) => {
          const exist = res.filter((x) => x);
          if (!exist.length || !showNotificationOnly) {
            return;
          }
          sendPushNotification();
        });
      });
  } catch (err) {
    console.error('[bgTask]sycnFormVersion failed:', err);
  }
};

const registerBackgroundTask = async (TASK_NAME, minimumInterval = 86400) => {
  try {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: minimumInterval,
      stopOnTerminate: true, // android only,
      startOnBoot: true, // android only
    });
  } catch (err) {
    console.error('Task Register failed:', err);
  }
};

const unregisterBackgroundTask = async (TASK_NAME) => {
  try {
    await BackgroundFetch.unregisterTaskAsync(TASK_NAME);
  } catch (err) {
    console.error('Task Unregister failed:', err);
  }
};

const backgroundTaskStatus = async (TASK_NAME, minimumInterval = 86400) => {
  const status = await BackgroundFetch.getStatusAsync();
  const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
  if (BackgroundFetch.BackgroundFetchStatus?.[status] === 'Available' && !isRegistered) {
    await registerBackgroundTask(TASK_NAME, minimumInterval);
  }
  console.log(`[${TASK_NAME}] Status`, status, isRegistered, minimumInterval);
};

const backgroundTaskHandler = () => {
  return {
    syncFormVersion,
    registerBackgroundTask,
    unregisterBackgroundTask,
    backgroundTaskStatus,
  };
};

const backgroundTask = backgroundTaskHandler();
export default backgroundTask;
